import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import goodsRouter from "./goodsRouter";
import cartRouter from "./cartRouter";
import memberRouter from "./memberRouter";
import adminRouter from "./adminRouter";
import qnaBoardRouter from "./qnaBoardRouter";
import PerformanceList from "../pages/performance/PerformanceList";
import PerformanceDetail from "../pages/performance/PerformanceDetail";
import PaymentComplete from "../components/pay/PaymentComplete";

const Loading = <div>Loading....</div>;

const Main = lazy(() => import("../pages/MainPage"));
const WishList = lazy(() => import("../pages/wishList/WishListPage"));

const root = createBrowserRouter([
	{
		path: "/",
		element: (
			<Suspense fallback={Loading}>
				<Main />
			</Suspense>
		),
	},
	{
		path: "/performances",
		element: (
			<Suspense fallback={Loading}>
				<PerformanceList />
			</Suspense>
		),
	},
	{
		path: "/performances/:pid", // 공연 상세 페이지 경로
		element: (
			<Suspense fallback={Loading}>
				<PerformanceDetail />
			</Suspense>
		),
	},
	{
		path: "/wishlist",
		element: (
			<Suspense fallback={Loading}>
				<WishList />
			</Suspense>
		),
	},
	{
		path: "/goods",
		children: goodsRouter,
	},
	{
		path: "/cart",
		children: cartRouter,
	},
	{
		path: "/board",
		children: qnaBoardRouter,
	},
	{
		path: "/member",
		children: memberRouter(),
	},
	{
		path: "admin",
		children: adminRouter(), // 관리자 관련 라우팅
	},
	{
		path: "/payment/complete",
		element: (
			<Suspense fallback={Loading}>
				<PaymentComplete />
			</Suspense>
		),
	},
]);

export default root;
