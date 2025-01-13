import { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import KakaoLoginComponent from "./KakaoLoginComponent";
import { Link } from "react-router-dom";
import "../../styles/login/LoginPage.scss";
import ResultModal from "../common/ResultModal";

const LoginComponent = () => {
	const [loginParam, setLoginParam] = useState({ id: "", pw: "" });

	const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가

	const { doLogin, moveToPath } = useCustomLogin();

	const [showModal, setShowModal] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setLoginParam({ ...loginParam, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrorMessage(""); // 에러 메시지 초기화

		doLogin(loginParam)
			.then((data) => {
				// 데이터가 없거나 응답이 유효하지 않을 때 처리
				if (!data || typeof data !== "object") {
					setErrorMessage("아이디와 비밀번호를 다시 확인하세요.");
					return;
				}

				// 서버에서 에러 메시지 전달
				if (data.error) {
					setErrorMessage(data.message || "아이디와 비밀번호를 다시 확인하세요.");
					return;
				}

				// 로그인 성공 처리
				setShowModal(true);
				// moveToPath("/");
			})
			.catch((error) => {
				// 네트워크 오류 또는 기타 예외 처리
				setErrorMessage(
					error.message ||
						"서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
				);
			});
	};

	const handleModalClose = () => {
		setShowModal(false);
		moveToPath("/"); // 모달 닫힌 후 페이지 이동
	};

	return (
		<div className="login-container">
			<div className="login-box">
				<h2 className="login-title">RE:PLACE</h2>
				{/* 에러 메시지 표시 */}
				{errorMessage && <div className="error-message">{errorMessage}</div>}
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="id">ID</label>
						<input
							id="id"
							name="id"
							type="text"
							placeholder="아이디를 입력하세요"
							value={loginParam.id}
							onChange={handleChange}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="pw">PW</label>
						<input
							id="pw"
							name="pw"
							type="password"
							placeholder="비밀번호를 입력하세요"
							value={loginParam.pw}
							onChange={handleChange}
						/>
					</div>
					<button type="submit" className="login-button">
						LOGIN
					</button>
				</form>
				<KakaoLoginComponent />
				<div className="register-link">
					<span>아직 회원이 아니신가요? </span>
					<Link to="/member/register">회원가입</Link>
				</div>
			</div>

			{/* 로그인 성공 모달 */}
			{showModal && (
				<ResultModal
					title="로그인 성공!"
					content="환영합니다! 🎉"
					callbackFn={handleModalClose}
				/>
			)}
		</div>
	);
};

export default LoginComponent;

// import { useState } from "react";
// import useCustomLogin from "../../hooks/useCustomLogin";
// import KakaoLoginComponent from "./KakaoLoginComponent";
// import { Link } from "react-router-dom";
// import "../../styles/login/LoginPage.scss";

// const LoginComponent = () => {
//   const [loginParam, setLoginParam] = useState({ id: "", pw: "" });
//   const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가
//   const { doLogin, moveToPath } = useCustomLogin();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginParam({ ...loginParam, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setErrorMessage(""); // 에러 메시지 초기화

//     doLogin(loginParam)
//       .then((data) => {
//         if (!data) {
//           setErrorMessage("서버 응답이 없습니다. 다시 시도해주세요.");
//           return;
//         }

//         if (data.error) {
//           setErrorMessage(
//             data.message || "아이디와 비밀번호를 다시 확인하세요."
//           );
//         } else {
//           alert("로그인 성공");
//           moveToPath("/");
//         }
//       })
//       .catch((error) => {
//         setErrorMessage(
//           error.message ||
//             "서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
//         );
//       });
//   };

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   setErrorMessage(""); // 에러 메시지 초기화

//   //   doLogin(loginParam)
//   //     .then((data) => {
//   //       if (data.error) {
//   //         setErrorMessage(
//   //           data.message || "아이디와 비밀번호를 다시 확인하세요."
//   //         ); // 서버 메시지 우선
//   //       } else {
//   //         //0102
//   //         // if (data.error) {
//   //         //   setErrorMessage("아이디와 비밀번호를 다시 확인하세요."); // 에러 메시지 상태 설정
//   //         // } else {
//   //         alert("로그인 성공");
//   //         moveToPath("/");
//   //       }
//   //     })
//   //     .catch((error) => {
//   //       setErrorMessage(
//   //         error.message ||
//   //           "서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
//   //       );
//   //     });
//   // };
//   // //0102
//   // //     .catch(() => {
//   // //       setErrorMessage(
//   // //         "서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
//   // //       );
//   // //     });
//   // // };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2 className="login-title">RE:PLACE</h2>
//         {/* 에러 메시지 표시 */}
//         {errorMessage && <div className="error-message">{errorMessage}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="id">ID</label>
//             <input
//               id="id"
//               name="id"
//               type="text"
//               placeholder="아이디를 입력하세요"
//               value={loginParam.id}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="pw">PW</label>
//             <input
//               id="pw"
//               name="pw"
//               type="password"
//               placeholder="비밀번호를 입력하세요"
//               value={loginParam.pw}
//               onChange={handleChange}
//             />
//           </div>
//           <button type="submit" className="login-button">
//             Login
//           </button>
//         </form>
//         <KakaoLoginComponent />
//         <div className="register-link">
//           <span>아직 회원이 아니신가요? </span>
//           <Link to="/member/register">회원가입</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginComponent;

// //1231

// // import { useState } from "react";
// // import useCustomLogin from "../../hooks/useCustomLogin";
// // import KakaoLoginComponent from "./KakaoLoginComponent";
// // import { Link } from "react-router-dom";
// // import "../../styles/login/LoginPage.scss";

// // const LoginComponent = () => {
// //   const [loginParam, setLoginParam] = useState({ id: "", pw: "" });
// //   const { doLogin, moveToPath } = useCustomLogin();

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setLoginParam({ ...loginParam, [name]: value });
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     doLogin(loginParam).then((data) => {
// //       if (data.error) {
// //         alert("아이디와 비밀번호를 다시 확인하세요");
// //       } else {
// //         alert("로그인 성공");
// //         moveToPath("/");
// //       }
// //     });
// //   };

// //   return (
// //     <div className="login-container">
// //       <div className="login-box">
// //         <h2 className="login-title">RE:PLACE</h2>
// //         <form onSubmit={handleSubmit}>
// //           <div className="form-group">
// //             <label htmlFor="id">ID</label>
// //             <input
// //               id="id"
// //               name="id"
// //               type="text"
// //               placeholder="아이디를 입력하세요"
// //               value={loginParam.id}
// //               onChange={handleChange}
// //             />
// //           </div>
// //           <div className="form-group">
// //             <label htmlFor="pw">PW</label>
// //             <input
// //               id="pw"
// //               name="pw"
// //               type="password"
// //               placeholder="비밀번호를 입력하세요"
// //               value={loginParam.pw}
// //               onChange={handleChange}
// //             />
// //           </div>
// //           <button type="submit" className="login-button">
// //             Login
// //           </button>
// //         </form>
// //         <KakaoLoginComponent />
// //         <div className="register-link">
// //           <span>아직 회원이 아니신가요? </span>
// //           <Link to="/member/register">회원가입</Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LoginComponent;

// //1230
// // import { useState } from "react";
// // import useCustomLogin from "../../hooks/useCustomLogin";
// // import KakaoLoginComponent from "./KakaoLoginComponent";
// // import { Link } from "react-router-dom";
// // import "../../styles/login/LoginPage.scss";

// // const LoginComponent = () => {
// //   const [loginParam, setLoginParam] = useState({ id: "", pw: "" });
// //   const { doLogin, moveToPath } = useCustomLogin();

// //   // 입력값 처리
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setLoginParam({ ...loginParam, [name]: value });
// //   };

// //   // 로그인 요청 (폼 제출 이벤트)
// //   const handleSubmit = (e) => {
// //     e.preventDefault(); // 폼의 기본 제출 동작 방지

// //     console.log("loginParam:", loginParam);

// //     doLogin(loginParam).then((data) => {
// //       if (data.error) {
// //         alert("아이디와 패스워드를 다시 확인하세요");
// //       } else {
// //         alert("로그인 성공");
// //         moveToPath("/");
// //       }
// //     });
// //   };

// //   return (
// //     <div>
// //       <h2>Login</h2>
// //       <form onSubmit={handleSubmit}>
// //         <div>
// //           <label>ID</label>
// //           <input
// //             name="id"
// //             type="text"
// //             value={loginParam.id}
// //             onChange={handleChange}
// //           />
// //         </div>
// //         <div>
// //           <label>Password</label>
// //           <input
// //             name="pw"
// //             type="password"
// //             value={loginParam.pw}
// //             onChange={handleChange}
// //           />
// //         </div>
// //         <div>
// //           <button type="submit">LOGIN</button> {/* type="submit" 추가 */}
// //         </div>
// //       </form>
// //       <KakaoLoginComponent />

// //       {/* 회원가입 텍스트 링크 */}
// //       <div style={{ marginTop: "15px" }}>
// //         <span>아직 회원이 아니신가요? </span>
// //         <Link
// //           to="/member/register"
// //           style={{ color: "#007BFF", textDecoration: "none" }}
// //         >
// //           회원가입
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LoginComponent;
