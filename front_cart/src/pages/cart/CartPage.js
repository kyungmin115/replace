import React, { useEffect } from "react";
import CartComponent from "../../components/cart/CartComponent";
import "../../styles/cart/CartPage.scss";
import { getCartItemsAsync } from "../../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const CartPage = () => {
	const dispatch = useDispatch();
	const { items, loading, error } = useSelector((state) => state.cart);

	// 장바구니 데이터를 가져오는 함수
	useEffect(() => {
		dispatch(getCartItemsAsync());
	}, [dispatch]);

	// 주문 버튼 클릭 시 실행
	const handleOrderClick = () => {
		const selectedItems =
			items?.[0]?.cartItemDTOList?.filter((item) => item.selected) || [];
		if (selectedItems.length === 0) {
			alert("주문할 상품을 선택해주세요.");
			return;
		}
		console.log("주문 진행 중...", selectedItems);
		// 예: navigate('/order', { state: { selectedItems } });
	};

	if (loading) return <div className="cart-loading">장바구니 로딩 중...</div>;
	if (error)
		return <div className="cart-error">장바구니 로딩 중 오류 발생: {error}</div>;

	// items가 없거나 cartItemDTOList가 없는 경우 체크
	const hasItems = items?.[0]?.cartItemDTOList?.length > 0;

	return (
		<div className="cart-page">
			<CartComponent />
			<div className="cart-summary">
				<button
					onClick={handleOrderClick}
					disabled={!hasItems}
					className="order-button">
					주문하기
				</button>
			</div>
		</div>
	);
};

export default CartPage;
