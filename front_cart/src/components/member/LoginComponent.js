import { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import KakaoLoginComponent from "./KakaoLoginComponent";
import { Link } from "react-router-dom";

const LoginComponent = () => {
	const [loginParam, setLoginParam] = useState({ id: "", pw: "" });
	const { doLogin, moveToPath } = useCustomLogin();

	// 입력값 처리
	const handleChange = (e) => {
		const { name, value } = e.target;
		setLoginParam({ ...loginParam, [name]: value });
	};

	// 로그인 요청 (폼 제출 이벤트)
	const handleSubmit = (e) => {
		e.preventDefault(); // 폼의 기본 제출 동작 방지
		doLogin(loginParam).then((data) => {
			if (data.error) {
				alert("아이디와 패스워드를 다시 확인하세요");
			} else {
				alert("로그인 성공");
				moveToPath("/");
			}
		});
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>ID</label>
					<input
						name="id"
						type="text"
						value={loginParam.id}
						onChange={handleChange}
					/>
				</div>
				<div>
					<label>Password</label>
					<input
						name="pw"
						type="password"
						value={loginParam.pw}
						onChange={handleChange}
					/>
				</div>
				<div>
					<button type="submit">LOGIN</button> {/* type="submit" 추가 */}
				</div>
			</form>
			<KakaoLoginComponent />

			{/* 회원가입 텍스트 링크 */}
			<div style={{ marginTop: "15px" }}>
				<span>아직 회원이 아니신가요? </span>
				<Link
					to="/member/register"
					style={{ color: "#007BFF", textDecoration: "none" }}>
					회원가입
				</Link>
			</div>
		</div>
	);
};

export default LoginComponent;
