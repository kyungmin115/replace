import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import goodsRouter from "./goodsRouter";
import cartRouter from "./cartRouter";
import memberRouter from "./memberRouter";
import PerformanceList from "../pages/performance/PerformanceList";
import PerformanceDetail from "../pages/performance/PerformanceDetail";

const Loading = <div>Loading....</div>;

const Main = lazy(() => import("../pages/MainPage"));
const Exhibition = lazy(() => import("../pages/ExhibitionPage"));
const Cart = lazy(() => import("../pages/cart/CartPage"));

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
		path: "/exhibition",
		element: (
			<Suspense fallback={Loading}>
				<Exhibition />
			</Suspense>
		),
	},
	{
		path: "/goods",
		children: goodsRouter,
	},
	{
		path: "/cart",
		element: (
			<Suspense fallback={Loading}>
				<Cart />
			</Suspense>
		),
		children: cartRouter,
	},
	{
		path: "member",
		children: memberRouter(),
	},
]);

export default root;
