import LoginComponent from "../../components/member/LoginComponent";
import BasicMenu from "../../components/menu/BasicMenu";

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
