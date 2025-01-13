import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { modifyMember } from "../../api/memberApi";
import useCheckDuplicate from "../../hooks/useCheckDuplicate";
import ResultModal from "../common/ResultModal";
import { useNavigate } from "react-router-dom";
import { getMemberInfo } from "../../api/memberApi";
import { useDispatch } from "react-redux";

import "../../styles/modify/ModifyPage.scss";

//회원수정

const initState = {
  email: "",
  pw: "",
  nickname: "",
  phone: "",
  newPw: "", // 새 비밀번호
  confirmPw: "", // 새 비밀번호 확인
  address: "",
  agreeEmail: false,
};

const MyComponent = () => {
  const dispatch = useDispatch();
  const [member, setMember] = useState(initState);
  const [errors, setErrors] = useState({});
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [result, setResult] = useState(null);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  const loginInfo = useSelector((state) => state.loginSlice);
  const { checkDuplicate } = useCheckDuplicate();
  const navigate = useNavigate();

  useEffect(() => {
    setMember({ ...loginInfo, pw: "" });
  }, [loginInfo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMember({
      ...member,
      [name]: type === "checkbox" ? checked : value || "",
    });
    setErrors({ ...errors, [name]: "" });

    if (name === "nickname") {
      setIsNicknameChecked(false); // 닉네임이 변경되면 중복 체크 상태 초기화
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!isNicknameChecked) {
      newErrors.nickname = "닉네임 중복 체크를 완료해주세요.";
    }

    if (!member.newPw || member.newPw.length < 4) {
      newErrors.newPw = "새 비밀번호는 최소 4자 이상이어야 합니다.";
    }

    if (member.newPw !== member.confirmPw) {
      newErrors.confirmPw = "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.";
    }

    if (!member.nickname || member.nickname.length < 2) {
      newErrors.nickname = "닉네임은 최소 2자 이상이어야 합니다.";
    }

    if (!member.phone || member.phone.length < 10) {
      newErrors.phone = "올바른 전화번호를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNicknameCheck = async () => {
    try {
      await checkDuplicate("nickname", member.nickname);
      setIsNicknameChecked(true);
      setModalContent({ title: "성공", content: "사용 가능한 닉네임입니다." });
      setResult("nicknameSuccess");
    } catch (error) {
      setIsNicknameChecked(false);
      setModalContent({
        title: "오류",
        content: "사용할 수 없는 닉네임입니다.",
      });
      setResult("nicknameError");
    }
  };

  const handleClickModify = async () => {
    const modifiedMember = {
      ...member,
      pw: member.newPw, // newPw를 pw로 매핑
    };
    delete modifiedMember.newPw; // newPw 제거
    delete modifiedMember.confirmPw; // confirmPw 제거

    if (!validate()) {
      setModalContent({ title: "오류", content: "입력값을 확인해주세요." });
      setResult("error");
      return;
    }

    if (!isNicknameChecked) {
      setModalContent({
        title: "오류",
        content: "닉네임 중복 체크를 완료해주세요.",
      });
      setResult("error");
      return;
    }

    try {
      //회원 정보 수정api 호출
      await modifyMember(modifiedMember);
      //최신 데이터 가져오기
      // const refreshedMember = await getMemberInfo();
      // // Redux 상태 업데이트
      // dispatch(setMember(refreshedMember));

      const refreshedMember = await getMemberInfo(); // 최신 데이터 가져오기
      setMember(refreshedMember); // React 상태 업데이트

      //성공 메세지 설정
      setModalContent({
        title: "성공",
        content: "정보 수정이 완료되었습니다.",
      });

      setResult("success");
    } catch (error) {
      setModalContent({
        title: "오류",
        content: "정보 수정 중 오류가 발생했습니다.",
      });
      setResult("error");
    }
  };

  const closeModal = () => {
    if (result === "success") {
      // 정보 수정 성공 시 홈으로 리다이렉트
      navigate("/");
    }
    setResult(null); // 상태 초기화
  };

  {
    result && result !== "nicknameSuccess" && (
      <ResultModal
        title={modalContent.title}
        content={modalContent.content}
        callbackFn={closeModal}
      />
    );
  }

  return (
    <div className="modify-page">
      <h2 className="modify-title">RE:PLACE</h2>
      {result && (
        <ResultModal
          title={modalContent.title}
          content={modalContent.content}
          callbackFn={closeModal}
        />
      )}
      <div className="form-group">
        <label>Email</label>
        <input name="email" type="text" value={member.email} readOnly />
      </div>

      <div className="form-group">
        <label>New Password</label>
        <input
          name="newPw"
          type="password"
          value={member.newPw}
          onChange={handleChange}
          placeholder="새 비밀번호를 입력하세요."
        />
        {errors.newPw && <div className="error-message">{errors.newPw}</div>}
      </div>

      <div className="form-group">
        <label>Confirm New Password</label>
        <input
          name="confirmPw"
          type="password"
          value={member.confirmPw}
          onChange={handleChange}
          placeholder="새 비밀번호를 다시 입력하세요."
        />
        {errors.confirmPw && (
          <div className="error-message">{errors.confirmPw}</div>
        )}
      </div>

      <div className="form-group">
        <label>Nickname</label>
        <input
          name="nickname"
          type="text"
          value={member.nickname || ""}
          onChange={handleChange}
          placeholder="닉네임은 최소 2자 이상이어야 합니다."
        />
        <button type="button" onClick={handleNicknameCheck}>
          중복 체크
        </button>
        {errors.nickname && (
          <div className="error-message">{errors.nickname}</div>
        )}
      </div>

      <div className="form-group">
        <label>PhoneNumber</label>
        <input
          type="text"
          name="phone"
          value={member.phone}
          onChange={handleChange}
          placeholder="전화번호 입력"
          maxLength={11}
        />
        {errors.phone && <div className="error-message">{errors.phone}</div>}
      </div>

      <div className="form-group">
        <label>Agree Email</label>
        <input
          name="agreeEmail"
          type="checkbox"
          checked={member.agreeEmail}
          onChange={handleChange}
        />
      </div>
      <div>
        <button type="button" onClick={handleClickModify}>
          RE:PLACE 회원 정보 수정
        </button>
      </div>
    </div>
  );
};

export default MyComponent;
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { modifyMember } from "../../api/memberApi";
// import useCheckDuplicate from "../../hooks/useCheckDuplicate";
// import ResultModal from "../common/ResultModal";
// import { useNavigate } from "react-router-dom";
// import { getMemberInfo } from "../../api/memberApi";

// import "../../styles/modify/ModifyPage.scss";

// //0110
// import { setMember } from "../../slices/loginSlice";
// import { useDispatch } from "react-redux";

// const initState = {
//   email: "",
//   pw: "",
//   nickname: "",
//   phone: "",
//   newPw: "", // 새 비밀번호
//   confirmPw: "", // 새 비밀번호 확인
//   address: "",
//   agreeEmail: false,
// };

// const MyComponent = () => {
//   const [member, setMember] = useState(initState);
//   const [errors, setErrors] = useState({});
//   const [isNicknameChecked, setIsNicknameChecked] = useState(false);
//   const [result, setResult] = useState(null);
//   const [modalContent, setModalContent] = useState({ title: "", content: "" });

//   const loginInfo = useSelector((state) => state.loginSlice);
//   const { checkDuplicate } = useCheckDuplicate();
//   const navigate = useNavigate();
//   //0110
//   const dispatch = useDispatch();

//   useEffect(() => {
//     setMember({ ...loginInfo, pw: "" });
//   }, [loginInfo]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setMember({
//       ...member,
//       [name]: type === "checkbox" ? checked : value || "",
//     });
//     setErrors({ ...errors, [name]: "" });

//     if (name === "nickname") {
//       setIsNicknameChecked(false); // 닉네임이 변경되면 중복 체크 상태 초기화
//     }
//   };

//   const validate = () => {
//     const newErrors = {};

//     if (!isNicknameChecked) {
//       newErrors.nickname = "닉네임 중복 체크를 완료해주세요.";
//     }

//     if (!member.newPw || member.newPw.length < 4) {
//       newErrors.newPw = "새 비밀번호는 최소 4자 이상이어야 합니다.";
//     }

//     if (member.newPw !== member.confirmPw) {
//       newErrors.confirmPw = "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.";
//     }

//     if (!member.nickname || member.nickname.length < 2) {
//       newErrors.nickname = "닉네임은 최소 2자 이상이어야 합니다.";
//     }

//     if (!member.phone || member.phone.length < 10) {
//       newErrors.phone = "올바른 전화번호를 입력해주세요.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNicknameCheck = async () => {
//     try {
//       await checkDuplicate("nickname", member.nickname);
//       setIsNicknameChecked(true);
//       setModalContent({ title: "성공", content: "사용 가능한 닉네임입니다." });
//       setResult("nicknameSuccess");
//     } catch (error) {
//       setIsNicknameChecked(false);
//       setModalContent({
//         title: "오류",
//         content: "사용할 수 없는 닉네임입니다.",
//       });
//       setResult("nicknameError");
//     }
//   };

//   const handleClickModify = async () => {
//     const modifiedMember = {
//       ...member,
//       pw: member.newPw, // newPw를 pw로 매핑
//     };
//     delete modifiedMember.newPw; // newPw 제거
//     delete modifiedMember.confirmPw; // confirmPw 제거

//     if (!validate()) {
//       setModalContent({ title: "오류", content: "입력값을 확인해주세요." });
//       setResult("error");
//       return;
//     }

//     if (!isNicknameChecked) {
//       setModalContent({
//         title: "오류",
//         content: "닉네임 중복 체크를 완료해주세요.",
//       });
//       setResult("error");
//       return;
//     }

//     try {
//       //회원 정보 수정api 호출
//       await modifyMember(modifiedMember);
//       // 0110Redux 상태 업데이트
//       dispatch(setMember({ nickname: modifiedMember.nickname }));

//       //성공 메세지 설정
//       setModalContent({
//         title: "성공",
//         content: "정보 수정이 완료되었습니다.",
//       });

//       setResult("success");
//     } catch (error) {
//       setModalContent({
//         title: "오류",
//         content: "정보 수정 중 오류가 발생했습니다.",
//       });
//       setResult("error");
//     }
//   };

//   const closeModal = () => {
//     if (result === "success") {
//       // 정보 수정 성공 시 홈으로 리다이렉트
//       navigate("/");
//     }
//     setResult(null); // 상태 초기화
//   };

//   result && result !== "nicknameSuccess" && (
//     <ResultModal
//       title={modalContent.title}
//       content={modalContent.content}
//       callbackFn={closeModal}
//     />
//   );

//   return (
//     <div className="modify-page">
//       <h2 className="modify-title">RE:PLACE</h2>
//       {result && (
//         <ResultModal
//           title={modalContent.title}
//           content={modalContent.content}
//           callbackFn={closeModal}
//         />
//       )}
//       <div className="form-group">
//         <label>Email</label>
//         <input name="email" type="text" value={member.email} readOnly />
//       </div>

//       <div className="form-group">
//         <label>New Password</label>
//         <input
//           name="newPw"
//           type="password"
//           value={member.newPw}
//           onChange={handleChange}
//           placeholder="새 비밀번호를 입력하세요."
//         />
//         {errors.newPw && <div className="error-message">{errors.newPw}</div>}
//       </div>

//       <div className="form-group">
//         <label>Confirm New Password</label>
//         <input
//           name="confirmPw"
//           type="password"
//           value={member.confirmPw}
//           onChange={handleChange}
//           placeholder="새 비밀번호를 다시 입력하세요."
//         />
//         {errors.confirmPw && (
//           <div className="error-message">{errors.confirmPw}</div>
//         )}
//       </div>

//       <div className="form-group">
//         <label>Nickname</label>
//         <input
//           name="nickname"
//           type="text"
//           value={member.nickname || ""}
//           onChange={handleChange}
//           placeholder="닉네임은 최소 2자 이상이어야 합니다."
//         />
//         <button type="button" onClick={handleNicknameCheck}>
//           중복 체크
//         </button>
//         {errors.nickname && (
//           <div className="error-message">{errors.nickname}</div>
//         )}
//       </div>

//       <div className="form-group">
//         <label>PhoneNumber</label>
//         <input
//           type="text"
//           name="phone"
//           value={member.phone}
//           onChange={handleChange}
//           placeholder="전화번호 입력"
//           maxLength={11}
//         />
//         {errors.phone && <div className="error-message">{errors.phone}</div>}
//       </div>

//       <div className="form-group">
//         <label>Agree Email</label>
//         <input
//           name="agreeEmail"
//           type="checkbox"
//           checked={member.agreeEmail}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
//         <button type="button" onClick={handleClickModify}>
//           RE:PLACE 회원 정보 수정
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MyComponent;

// import React, { useState, useEffect } from "react";
// import { getMemberInfo, modifyMember } from "../../api/memberApi";

// const MyComponent = ({ isEditMode, onEditClick, onCancelClick }) => {
//   const [userData, setUserData] = useState(null);
//   const [formData, setFormData] = useState({ nickname: "", address: "" });
//   const [message, setMessage] = useState(null);

//   //0107 새롭게 시작
//   useEffect(() => {
//     // 사용자 정보 가져오기
//     const fetchUserData = async () => {
//       try {
//         const data = await getMemberInfo();
//         setUserData(data);
//         setFormData({
//           nickname: data.nickname || "",
//           address: data.address || "",
//         });
//       } catch (error) {
//         console.error("사용자 정보 가져오기 오류:", error);
//         setMessage("사용자 정보를 가져오는 중 문제가 발생했습니다.");
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const updatedFormData = { ...formData, id: userData.id };

//     try {
//       const response = await modifyMember(updatedFormData); // 수정 요청
//       setUserData(response.data); // 사용자 정보 갱신
//       setMessage("회원 정보가 성공적으로 수정되었습니다.");
//       onCancelClick();
//     } catch (error) {
//       console.error("회원 정보 수정 오류:", error);
//       setMessage("회원 정보 수정 중 문제가 발생했습니다.");
//     }
//   };

//   return (
//     <div>
//       {isEditMode ? (
//         // 수정 폼
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label>닉네임:</label>
//             <input
//               type="text"
//               name="nickname"
//               value={formData.nickname}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div>
//             <label>주소:</label>
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleInputChange}
//             />
//           </div>
//           <button type="submit">저장</button>
//           <button type="button" onClick={onCancelClick}>
//             취소
//           </button>
//         </form>
//       ) : (
//         // 사용자 정보 표시
//         <div>
//           <p>
//             <strong>닉네임:</strong> {userData?.nickname}
//           </p>
//           <p>
//             <strong>주소:</strong> {userData?.address}
//           </p>
//           <button onClick={onEditClick}>회원 정보 수정</button>
//         </div>
//       )}
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default MyComponent;

// // import React, { useState, useEffect } from "react";
// // import useCustomLogin from "../../hooks/useCustomLogin";
// // import { getMemberInfo } from "../../api/memberApi";

// // const MyComponent = () => {
// //   const [userData, setUserData] = useState(null);
// //   const [formData, setFormData] = useState({ nickname: "", address: "" });
// //   const [message, setMessage] = useState(null);
// //   const { isLogin, moveToLogin } = useCustomLogin();

// //   useEffect(() => {
// //     // 로그인 상태 확인
// //     if (!isLogin) {
// //       alert("로그인이 필요합니다.");
// //       moveToLogin();
// //       return;
// //     }

// //     // 사용자 데이터 가져오기
// //     const fetchUserData = async () => {
// //       try {
// //         const data = await getMemberInfo();
// //         setUserData(data);
// //         setFormData({
// //           nickname: data.nickname || "",
// //           address: data.address || "",
// //         });
// //       } catch (error) {
// //         console.error("사용자 정보 가져오기 오류:", error);
// //         setMessage("사용자 정보를 가져오는 중 문제가 발생했습니다.");
// //       }
// //     };

// //     fetchUserData();
// //   }, [isLogin]);

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       console.log("수정 요청:", formData);
// //       setMessage("회원 정보가 성공적으로 수정되었습니다.");
// //     } catch (error) {
// //       console.error("회원 정보 수정 오류:", error);
// //       setMessage("회원 정보 수정 중 문제가 발생했습니다.");
// //     }
// //   };

// //   if (!isLogin) {
// //     return null; // 로그인 상태 확인 중이라면 아무 것도 렌더링하지 않음
// //   }

// //   return (
// //     <div>
// //       {userData && (
// //         <form onSubmit={handleSubmit}>
// //           <div>
// //             <label>닉네임:</label>
// //             <input
// //               type="text"
// //               name="nickname"
// //               value={formData.nickname}
// //               onChange={handleInputChange}
// //             />
// //           </div>
// //           <div>
// //             <label>주소:</label>
// //             <input
// //               type="text"
// //               name="address"
// //               value={formData.address}
// //               onChange={handleInputChange}
// //             />
// //           </div>
// //           <button type="submit">수정</button>
// //         </form>
// //       )}
// //       {message && <p>{message}</p>}
// //     </div>
// //   );
// // };

// // export default MyComponent;
