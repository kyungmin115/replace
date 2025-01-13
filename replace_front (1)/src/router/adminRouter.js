// import { Suspense, lazy, useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import axios from "axios";

// const Loading = <div>Loading....</div>;
// const AdminComponent = lazy(() => import("../component/admin/AdminComponent"));

// const adminRouter = () => {
//   const AdminRoute = ({ children }) => {
//     const [isAdmin, setIsAdmin] = useState(null);

//     useEffect(() => {
//       axios
//         .get("http://localhost:8080/api/admin/validate", {
//           withCredentials: true,
//         })
//         .then((response) => {
//           setIsAdmin(response.data.isAdmin);
//         })
//         .catch(() => {
//           setIsAdmin(false);
//         });
//     }, []);

//     if (isAdmin === null) {
//       // 로딩 상태
//       return <div>Loading...</div>;
//     }

//     if (!isAdmin) {
//       // 관리자가 아닌 경우 리다이렉트 처리
//       alert("관리자 권한이 필요합니다.");
//       return <Navigate to="/" replace />;
//     }

//     // 관리자인 경우 컴포넌트를 렌더링
//     return children;
//   };

//   return [
//     {
//       path: "members",
//       element: (
//         <AdminRoute>
//           <Suspense fallback={Loading}>
//             <AdminComponent />
//           </Suspense>
//         </AdminRoute>
//       ),
//     },
//   ];
// };

// export default adminRouter;

//1231 원본
import { Suspense, lazy } from "react";

const Loading = <div>Loading....</div>;
const Admin = lazy(() => import("../pages/admin/AdminPage"));

const adminRouter = () => {
	return [
		{
			path: "members",
			element: (
				<Suspense fallback={Loading}>
					<Admin />
				</Suspense>
			),
		},
	];
};

export default adminRouter;

// import { Suspense, lazy } from "react";

// const Loading = <div>Loading....</div>;
// const AdminPage = lazy(() => import("../pages/admin/AdminPage")); // 관리자 메인 페이지
// const AdminComponent = lazy(() => import("../component/admin/AdminComponent")); // 통합된 회원 관리 컴포넌트

// const adminRouter = () => {
//   return [
//     {
//       path: "", // /admin
//       element: (
//         <Suspense fallback={Loading}>
//           <AdminPage />
//         </Suspense>
//       ),
//     },
//     {
//       path: "members", // /admin/members
//       element: (
//         <Suspense fallback={Loading}>
//           <AdminComponent />
//         </Suspense>
//       ),
//     },
//   ];
// };

// export default adminRouter;
