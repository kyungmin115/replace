import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;
const QnaIndex = lazy(() => import("../pages/qna/IndexPage"));
const QnaBoardList = lazy(() => import("../pages/qna/QnaBoardListPage"));
const QnaBoardRead = lazy(() => import("../pages/qna/QnaBoardDetailPage"));
const QnaBoardAdd = lazy(() => import("../pages/qna/QnaBoardAddPage"));
const QnaBoardModify = lazy(() => import("../pages/qna/QnaBoardModifyPage"));

const qnaBoardRouter = [
	{
		path: "",
		element: (
			<Suspense fallback={Loading}>
				<QnaIndex />
			</Suspense>
		),
	},
	{
		path: "list",
		element: (
			<Suspense fallback={Loading}>
				<QnaBoardList />
			</Suspense>
		),
	},
	// {
	// 	path:"",
	// 	element:<Navigate replace to ="list"/>
	// },
	{
		path: "read/:qno",
		element: (
			<Suspense fallback={Loading}>
				<QnaBoardRead />
			</Suspense>
		),
	},
	{
		path: "add",
		element: (
			<Suspense fallback={Loading}>
				<QnaBoardAdd />
			</Suspense>
		),
	},
	{
		path: "list/:qno",
		element: (
			<Suspense fallback={Loading}>
				<QnaBoardRead />
			</Suspense>
		),
	},
	{
		path: "modify/:qno",
		element: (
			<Suspense fallback={Loading}>
				<QnaBoardModify />
			</Suspense>
		),
	},
];

export default qnaBoardRouter;