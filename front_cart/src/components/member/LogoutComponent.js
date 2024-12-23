import useCustomLogin from "../../hooks/useCustomLogin";

const LogoutComponent = () => {
	const { doLogout, moveToPath } = useCustomLogin();

	const handleClickLogout = () => {
		doLogout();
		alert("로그아웃되었습니다.");
		moveToPath("/");
	};

	return (
		<div>
			<div>
				<h2>Logout Component</h2>
			</div>
			<div>
				<button onClick={handleClickLogout}>LOGOUT</button>
			</div>
		</div>
	);
};

export default LogoutComponent;
