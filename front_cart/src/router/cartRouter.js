import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;
const Cart = lazy(() => import("../pages/cart/CartPage"));

const cartRouter = [
	{
		path: "", // 카트 페이지
		element: (
			<Suspense fallback={Loading}>
				<Cart />
			</Suspense>
		),
	},
];

export default cartRouter;
