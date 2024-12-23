import React, { useState } from "react";
import axios from "axios";
import useCheckDuplicate from "../../hooks/useCheckDuplicate";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		id: "",
		pw: "",
		email: "",
		nickname: "",
		address: "",
		phoneNumber: "",
		agreeEmail: false,
		birthDate: "",
		roleNames: ["USER"],
	});

	const { checkDuplicate, errorMessage } = useCheckDuplicate(); // 중복 확인 훅 사용

	const [isIdAvailable, setIsIdAvailable] = useState(false);
	const [isEmailAvailable, setIsEmailAvailable] = useState(false);
	const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

	// 입력값 변경 핸들러
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	// ID 중복 체크 버튼 핸들러
	const handleIdCheck = async () => {
		try {
			await checkDuplicate("id", formData.id);
			setIsIdAvailable(true);
			alert("사용 가능한 ID입니다.");
		} catch (error) {
			setIsIdAvailable(false);
		}
	};

	// Email 중복 체크 버튼 핸들러
	const handleEmailCheck = async () => {
		try {
			await checkDuplicate("email", formData.email);
			setIsEmailAvailable(true);
			alert("사용 가능한 Email입니다.");
		} catch (error) {
			setIsEmailAvailable(false);
		}
	};

	// Nickname 중복 체크 버튼 핸들러
	const handleNicknameCheck = async () => {
		try {
			await checkDuplicate("nickname", formData.nickname);
			setIsNicknameAvailable(true);
			alert("사용 가능한 Nickname입니다.");
		} catch (error) {
			setIsNicknameAvailable(false);
		}
	};

	// 폼 제출 핸들러
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isIdAvailable || !isEmailAvailable || !isNicknameAvailable) {
			alert("중복 체크를 모두 완료해주세요.");
			return;
		}
		try {
			const response = await axios.post(
				"http://localhost:8080/api/member/register",
				formData,
			);
			alert(response.data.message || "회원가입 성공!");
		} catch (error) {
			alert(error.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
		}
	};

	return (
		<div style={{ textAlign: "center", marginTop: "50px" }}>
			<h2>회원가입</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>ID</label>
					<input
						type="text"
						name="id"
						value={formData.id}
						onChange={handleChange}
						placeholder="아이디 입력"
					/>
					<button type="button" onClick={handleIdCheck}>
						중복 체크
					</button>
				</div>
				<div>
					<label>PW</label>
					<input
						type="password"
						name="pw"
						value={formData.pw}
						onChange={handleChange}
						placeholder="비밀번호 입력"
					/>
				</div>

				<div>
					<label>Email</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="이메일 입력"
					/>
					<button type="button" onClick={handleEmailCheck}>
						중복 체크
					</button>
				</div>
				<div>
					<label>NickName</label>
					<input
						type="text"
						name="nickname"
						value={formData.nickname}
						onChange={handleChange}
						placeholder="닉네임 입력"
					/>
					<button type="button" onClick={handleNicknameCheck}>
						중복 체크
					</button>
				</div>
				<div>
					<label>Birth Date</label>
					<input
						type="number"
						name="birthDate"
						value={formData.birthDate}
						onChange={handleChange}
						placeholder="생년월일(6자리) 입력"
					/>
				</div>
				<div>
					<label>Address</label>
					<input
						type="text"
						name="address"
						value={formData.address}
						onChange={handleChange}
						placeholder="주소 입력"
					/>
				</div>
				<div>
					<label>PhoneNumber</label>
					<input
						type="number"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						placeholder="전화번호 입력"
					/>
				</div>
				<div>
					<label>Agree E-mail Service</label>
					<input
						type="checkbox"
						name="agreeEmail"
						checked={formData.agreeEmail}
						onChange={handleChange}
					/>
				</div>
				<button type="submit">회원가입</button>
			</form>
			{errorMessage && (
				<div style={{ color: "red", marginTop: "20px" }}>{errorMessage}</div>
			)}
		</div>
	);
};

export default RegisterPage;
