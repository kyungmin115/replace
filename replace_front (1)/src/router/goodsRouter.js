import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading...</div>;
const GoodsList = lazy(() => import("../pages/goods/GoodsListPage"));
const GoodsRead = lazy(() => import("../pages/goods/GoodsReadPage"));
const SearchResults = lazy(() =>
	import("../pages/goods/GoodsSearchResultsPage"),
);

// 굿즈 관련 라우터
const goodsRouter = [
	{
		path: "list", // 굿즈 목록 페이지
		element: (
			<Suspense fallback={Loading}>
				<GoodsList />
			</Suspense>
		),
	},
	{
		path: ":goodsId", // 굿즈 상세 페이지
		element: (
			<Suspense fallback={Loading}>
				<GoodsRead />
			</Suspense>
		),
	},
	{
		path: "search", // 검색 결과 페이지
		element: (
			<Suspense fallback={Loading}>
				<SearchResults />
			</Suspense>
		),
	},
	{
		path: "", // 기본 경로에서 자동으로 목록 페이지로 리다이렉트
		element: <Navigate replace to="/goods/list" />,
	},
];

export default goodsRouter;
