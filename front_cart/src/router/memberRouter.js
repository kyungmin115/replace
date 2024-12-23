import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;
const LoginPage = lazy(() => import("../pages/member/LoginPage"));
const LogoutPage = lazy(() => import("../pages/member/LogoutPage"));
const KakaoRedirect = lazy(() => import("../pages/member/KakaoRedirectPage"));
const MemberModify = lazy(() => import("../pages/member/ModifyPage"));
const RegisterPage = lazy(() => import("../pages/member/RegisterPage"));

const memberRouter = () => {
	return [
		{
			path: "login",
			element: (
				<Suspense fallback={Loading}>
					<LoginPage />
				</Suspense>
			),
		},
		{
			path: "logout",
			element: (
				<Suspense fallback={Loading}>
					<LogoutPage />
				</Suspense>
			),
		},
		{
			path: "kakao",
			element: (
				<Suspense fallback={Loading}>
					<KakaoRedirect />
				</Suspense>
			),
		},
		{
			path: "modify",
			element: (
				<Suspense fallback={Loading}>
					<MemberModify />
				</Suspense>
			),
		},

		{
			path: "register",
			element: (
				<Suspense fallback={Loading}>
					<RegisterPage />
				</Suspense>
			),
		},
	];
};

export default memberRouter;
