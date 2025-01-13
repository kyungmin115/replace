import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartItemsAsync } from "../../slices/cartSlice";
import CartComponent from "../../components/cart/CartComponent";
import "../../styles/cart/CartPage.scss";
import BasicLayout from "../../layout/BasicLayout";

const CartPage = () => {
	const dispatch = useDispatch();
	const { loading, error } = useSelector((state) => state.cart);

	// 장바구니 데이터를 가져오는 함수
	useEffect(() => {
		dispatch(getCartItemsAsync());
	}, [dispatch]);

	if (loading) return <div className="cart-loading">장바구니 로딩 중...</div>;
	if (error)
		return <div className="cart-error">장바구니 로딩 중 오류 발생: {error}</div>;

	return (
		<>
			<BasicLayout />
			<div className="cart-page">
				<CartComponent />
			</div>
		</>
	);
};

export default CartPage;
