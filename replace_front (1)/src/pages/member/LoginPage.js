import BasicMenu from "../../components/menu/BasicMenu";
import LoginComponent from "../../components/member/LoginComponent";
import "../../styles/login/LoginPage.scss";

const LoginPage = () => {
	return (
		<div>
			<BasicMenu />
			<div>
				<LoginComponent />
			</div>
		</div>
	);
};

export default LoginPage;
