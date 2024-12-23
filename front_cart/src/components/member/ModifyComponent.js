import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { modifyMember } from "../../api/memberApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import ResultModal from "../common/ResultModal";

const initState = {
	email: "",
	pw: "",
	nickname: "",
};

const ModifyComponent = () => {
	const [member, setMember] = useState(initState);
	const loginInfo = useSelector((state) => state.loginSlice);

	const { moveToLogin } = useCustomLogin();
	const [result, setResult] = useState();

	useEffect(() => {
		setMember({ ...loginInfo, pw: "ABCD" });
	}, [loginInfo]);

	const handleChange = (e) => {
		member[e.target.name] = e.target.value;
		setMember({ ...member });
	};

	const handleClickModify = () => {
		modifyMember(member).then((result) => {
			setResult("Modified");
		});
	};

	const closeModal = () => {
		setResult(null);
		moveToLogin();
	};

	return (
		<div>
			{result ? (
				<ResultModal
					title={"회원정보"}
					content={"정보수정완료"}
					callbackFn={closeModal}
				/>
			) : null}
			<div>
				<label>Email</label>
				<input name="email" type="text" value={member.email} readOnly />
			</div>
			<div>
				<label>Password</label>
				<input
					name="pw"
					type="password"
					value={member.pw}
					onChange={handleChange}
				/>
			</div>
			<div>
				<label>Nickname</label>
				<input
					name="nickname"
					type="text"
					value={member.nickname}
					onChange={handleChange}
				/>
			</div>
			<div>
				<button type="button" onClick={handleClickModify}>
					Modify
				</button>
			</div>
		</div>
	);
};

export default ModifyComponent;
