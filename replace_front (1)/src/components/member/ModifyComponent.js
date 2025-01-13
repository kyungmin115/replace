import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { modifyMember } from "../../api/memberApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import useCheckDuplicate from "../../hooks/useCheckDuplicate";
import ResultModal from "../common/ResultModal";
import { useNavigate } from "react-router-dom";

//소셜회원 수정
import "../../styles/modify/ModifyPage.scss";

const initState = {
  email: "",
  pw: "",
  nickname: "",
  phone: "",
  agreeEmail: false,
};

const ModifyComponent = () => {
  const [member, setMember] = useState(initState);
  const [errors, setErrors] = useState({});
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [result, setResult] = useState(null);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  const loginInfo = useSelector((state) => state.loginSlice);
  const { checkDuplicate } = useCheckDuplicate();
  const { moveToLogin } = useCustomLogin();
  const navigate = useNavigate();

  useEffect(() => {
    setMember({ ...loginInfo, pw: "" });
  }, [loginInfo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMember({
      ...member,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "" });
    if (name === "nickname") {
      setIsNicknameChecked(false); // 닉네임이 변경되면 중복 체크 상태 초기화
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!member.pw || member.pw.length < 4) {
      newErrors.pw = "비밀번호는 최소 4자 이상이어야 합니다.";
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
      setResult("success");
    } catch (error) {
      setIsNicknameChecked(false);
      setModalContent({
        title: "오류",
        content: "사용할 수 없는 닉네임입니다.",
      });
      setResult("error");
    }
  };

  const handleClickModify = async () => {
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
      await modifyMember(member);
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
    setResult(null);
  };

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
        <label>Password</label>
        <input
          name="pw"
          type="password"
          value={member.pw}
          onChange={handleChange}
          placeholder="비밀번호는 최소 4자리 입니다."
        />
        {errors.pw && <div className="error-message">{errors.pw}</div>}
      </div>
      <div className="form-group">
        <label>Nickname</label>
        <input
          name="nickname"
          type="text"
          value={member.nickname}
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

export default ModifyComponent;

// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { modifyMember } from "../../api/memberApi";
// import useCustomLogin from "../../hooks/useCustomLogin";
// import ResultModal from "../common/ResultModal";

// const initState = {
//   email: "",
//   pw: "",
//   nickname: "",
//   agreeEmail: false,
// };

// const ModifyComponent = () => {
//   const [member, setMember] = useState(initState);
//   const loginInfo = useSelector((state) => state.loginSlice);

//   const { moveToLogin } = useCustomLogin();
//   const [result, setResult] = useState();

//   useEffect(() => {
//     setMember({ ...loginInfo, pw: "" });
//   }, [loginInfo]);

//   const handleChange = (e) => {
//     member[e.target.name] = e.target.value;
//     setMember({ ...member });
//   };

//   const handleClickModify = () => {
//     modifyMember(member).then((result) => {
//       setResult("Modified");
//     });
//   };

//   const closeModal = () => {
//     setResult(null);
//     moveToLogin();
//   };

//   return (
//     <div>
//       {result ? (
//         <ResultModal
//           title={"회원정보"}
//           content={"정보수정완료"}
//           callbackFn={closeModal}
//         />
//       ) : null}
//       <div>
//         <label>Email</label>
//         <input name="email" type="text" value={member.email} readOnly />
//       </div>
//       <div>
//         <label>Password</label>
//         <input
//           name="pw"
//           type="password"
//           value={member.pw}
//           onChange={handleChange}
//         />
//       </div>

//       <div>
//         <label>Nickname</label>
//         <input
//           name="nickname"
//           type="text"
//           value={member.nickname}
//           onChange={handleChange}
//         />
//       </div>
//       <div>
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
//       <div>
//         <label>Agree Email</label>
//         <input
//           name="agreeEmail"
//           type="checkbox"
//           checked={member.agreeEmail} // 체크박스 상태와 연결
//           onChange={handleChange}
//         />
//       </div>

//       <div>
//         <button type="button" onClick={handleClickModify}>
//           회원정보수정
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ModifyComponent;
