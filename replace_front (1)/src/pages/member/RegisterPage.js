import React, { useState } from "react";
import axios from "axios";
import useCheckDuplicate from "../../hooks/useCheckDuplicate";
import { useNavigate } from "react-router-dom";
import ResultModal from "../../components/common/ResultModal";
import "../../styles/register/RegisterPage.scss";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		id: "",
		pw: "",
		email: "",
		nickname: "",
		address: "",
		phone: "",
		agreeEmail: false,
		birthDate: "",
		roleNames: ["USER"],
	});

	const [errors, setErrors] = useState({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState({ title: "", content: "" });

	const { checkDuplicate, errorMessage } = useCheckDuplicate();
	const [isIdAvailable, setIsIdAvailable] = useState(false);
	const [isEmailAvailable, setIsEmailAvailable] = useState(false);
	const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

	const navigate = useNavigate();

	// 입력값 변경 핸들러
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
		setErrors({ ...errors, [name]: "" });
	};

	// 유효성 검사
	const validate = () => {
		const newErrors = {};

		if (
			!formData.id ||
			!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/.test(formData.id)
		) {
			newErrors.id = "ID는 영문과 숫자를 포함하며 최소 4자 이상이어야 합니다.";
		}

		if (!formData.pw || formData.pw.length < 4) {
			newErrors.pw = "비밀번호는 최소 4자 이상이어야 합니다.";
		}

		if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "올바른 이메일 형식을 입력해주세요.";
		}

		if (!formData.nickname || formData.nickname.length < 2) {
			newErrors.nickname = "닉네임은 최소 2자 이상이어야 합니다.";
		}

		if (!formData.birthDate || formData.birthDate.length !== 6) {
			newErrors.birthDate = "생년월일은 6자리여야 합니다.";
		}

		if (!formData.address) {
			newErrors.address = "주소를 입력해주세요.";
		}

		if (!formData.phone || formData.phone.length < 10) {
			newErrors.phone = "올바른 전화번호를 입력해주세요.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleIdCheck = async () => {
		try {
			await checkDuplicate("id", formData.id);
			setIsIdAvailable(true);
			setModalContent({ title: "성공", content: "사용 가능한 ID입니다." });
			setIsModalOpen(true);
		} catch (error) {
			setIsIdAvailable(false);
			setModalContent({ title: "오류", content: "사용할 수 없는 ID입니다." });
			setIsModalOpen(true);
		}
	};

	const handleEmailCheck = async () => {
		try {
			await checkDuplicate("email", formData.email);
			setIsEmailAvailable(true);
			setModalContent({ title: "성공", content: "사용 가능한 Email입니다." });
			setIsModalOpen(true);
		} catch (error) {
			setIsEmailAvailable(false);
			setModalContent({
				title: "오류",
				content: "사용할 수 없는 Email입니다.",
			});
			setIsModalOpen(true);
		}
	};

	const handleNicknameCheck = async () => {
		try {
			await checkDuplicate("nickname", formData.nickname);
			setIsNicknameAvailable(true);
			setModalContent({
				title: "성공",
				content: "사용 가능한 Nickname입니다.",
			});
			setIsModalOpen(true);
		} catch (error) {
			setIsNicknameAvailable(false);
			setModalContent({
				title: "오류",
				content: "사용할 수 없는 Nickname입니다.",
			});
			setIsModalOpen(true);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) {
			setModalContent({ title: "오류", content: "입력값을 확인해주세요." });
			setIsModalOpen(true);
			return;
		}

		if (!isIdAvailable || !isEmailAvailable || !isNicknameAvailable) {
			setModalContent({
				title: "오류",
				content: "중복 체크를 모두 완료해주세요.",
			});
			setIsModalOpen(true);
			return;
		}

		try {
			const response = await axios.post(
				"http://localhost:8080/api/member/register",
				formData,
			);
			setModalContent({
				title: "성공",
				content: response.data.message || "회원가입 성공!",
			});
			setIsModalOpen(true);
			navigate("/member/login");
		} catch (error) {
			setModalContent({
				title: "오류",
				content: "회원가입 중 오류가 발생했습니다.",
			});
			setIsModalOpen(true);
		}
	};

	return (
		<div className="register-page">
			<h2>회원가입</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>ID</label>
					<input
						type="text"
						name="id"
						value={formData.id}
						onChange={handleChange}
						placeholder="영문,숫자 포함 4자리 이상 작성해주세요."
					/>
					<button type="button" onClick={handleIdCheck}>
						중복 체크
					</button>
					{errors.id && <div className="error-message">{errors.id}</div>}
				</div>
				<div>
					<label>PW</label>
					<input
						type="password"
						name="pw"
						value={formData.pw}
						onChange={handleChange}
						placeholder="비밀번호는 최소 4자리 입니다."
					/>
					{errors.pw && <div className="error-message">{errors.pw}</div>}
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
					{errors.email && <div className="error-message">{errors.email}</div>}
				</div>
				<div>
					<label>NickName</label>
					<input
						type="text"
						name="nickname"
						value={formData.nickname}
						onChange={handleChange}
						placeholder="닉네임은 최소2글자, 특수문자는 사용 불가 합니다"
					/>
					<button type="button" onClick={handleNicknameCheck}>
						중복 체크
					</button>
					{errors.nickname && <div className="error-message">{errors.nickname}</div>}
				</div>
				<div>
					<label>Birth Date</label>
					<input
						type="text"
						name="birthDate"
						value={formData.birthDate}
						onChange={handleChange}
						placeholder="생년월일(6자리) 입력"
						maxLength={6}
					/>
					{errors.birthDate && (
						<div className="error-message">{errors.birthDate}</div>
					)}
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
					{errors.address && <div className="error-message">{errors.address}</div>}
				</div>
				<div>
					<label>PhoneNumber</label>
					<input
						type="text"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						placeholder="전화번호 입력"
						maxLength={11}
					/>
					{errors.phone && <div className="error-message">{errors.phone}</div>}
				</div>
				<div>
					<label>Agree E-mail Service</label>
					<h4>Re:Place의 이벤트 소식을 받아보세요!</h4>
					<input
						type="checkbox"
						name="agreeEmail"
						checked={formData.agreeEmail}
						onChange={handleChange}
					/>
				</div>

				<button type="submit" className="submit-button">
					회원가입
				</button>
			</form>
			{errorMessage && <div className="error-global">{errorMessage}</div>}
			{isModalOpen && (
				<ResultModal
					title={modalContent.title}
					content={modalContent.content}
					callbackFn={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default RegisterPage;
