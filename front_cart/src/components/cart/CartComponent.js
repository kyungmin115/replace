import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	updateCartItemSelectionAsync,
	updateCartItemQuantityAsync,
	removeItemFromCartAsync,
	removeSelectedItemsAsync,
	selectAllCartItemsAsync,
} from "../../slices/cartSlice";
import "../../styles/cart/CartPage.scss";

const CartComponent = () => {
	const dispatch = useDispatch();
	const { items, selectAll } = useSelector((state) => state.cart);

	const cartItemsList = items?.[0]?.cartItemDTOList || [];

	// 현재 모든 아이템의 선택 상태를 확인하여 selectAll 상태만 업데이트
	useEffect(() => {
		if (cartItemsList.length > 0) {
			const allSelected = cartItemsList.every((item) => item.selected);
			// selectAll 상태가 실제 아이템들의 선택 상태와 다른 경우에만 업데이트
			if (allSelected !== selectAll) {
				// 여기서는 실제 아이템들의 상태를 변경하지 않고 selectAll 상태만 업데이트
				dispatch({
					type: "cart/setSelectAll",
					payload: allSelected,
				});
			}
		}
	}, [cartItemsList, selectAll, dispatch]);

	// 전체 선택 상태를 업데이트하는 함수
	const handleSelectAll = () => {
		const updatedSelectAll = !selectAll;
		dispatch(selectAllCartItemsAsync(updatedSelectAll));
	};

	// 단일 아이템 선택 상태를 업데이트하는 함수
	const handleItemSelection = (cartItemId, isSelected) => {
		dispatch(updateCartItemSelectionAsync({ cartItemId, isSelected }));
	};

	// 수량 변경
	const handleQuantityChange = (cartItemId, quantity) => {
		console.log({ cartItemId, quantity });
		if (quantity > 0) {
			dispatch(updateCartItemQuantityAsync({ cartItemId, quantity }));
		}
	};

	// 단일 아이템 삭제
	const handleRemoveItem = (cartItemId) => {
		dispatch(removeItemFromCartAsync(cartItemId));
	};

	// 선택된 아이템 삭제
	const handleRemoveSelectedItems = () => {
		const selectedItems = cartItemsList.filter((item) => item.selected);
		if (selectedItems.length === 0) {
			alert("삭제할 아이템을 선택해주세요.");
			return;
		}
		dispatch(removeSelectedItemsAsync());
	};

	// 총 주문 금액 계산
	const calculateTotalPrice = () => {
		return cartItemsList
			.filter((item) => item.selected)
			.reduce((total, item) => total + (item.goodsPrice * item.quantity || 0), 0);
	};

	return (
		<div className="cart-component">
			{/* 장바구니 헤더 */}
			<div className="cart-header">
				<label>
					<input
						type="checkbox"
						checked={selectAll}
						onChange={handleSelectAll}
						disabled={cartItemsList.length === 0}
					/>
					전체 선택
				</label>
				<button onClick={handleRemoveSelectedItems}>✕ 선택 삭제</button>
			</div>

			{/* 장바구니가 비어 있을 때 */}
			{cartItemsList.length === 0 ? (
				<div className="empty-cart">장바구니가 비어 있습니다.</div>
			) : (
				<>
					{/* 장바구니 아이템 목록 렌더링 */}
					<div className="cart-items">
						{cartItemsList.map((item) => (
							<div key={item.cartItemId} className="cart-item">
								<input
									type="checkbox"
									checked={item.selected}
									onChange={() => handleItemSelection(item.cartItemId, !item.selected)}
								/>
								<Link to={`/goods/${item.goodsId}`}>
									<img
										src={item.goodsImgUrl}
										alt={item.goodsName}
										className="cart-item-image"
									/>
								</Link>
								<div className="cart-item-details">
									<h3>{item.goodsName}</h3>
									<p>
										가격:{" "}
										{item.goodsPrice
											? item.goodsPrice.toLocaleString()
											: "가격 정보 없음"}
										원
									</p>
									<div className="quantity-control">
										<p>수량:</p>
										<button
											onClick={() =>
												handleQuantityChange(item.cartItemId, item.quantity - 1)
											}
											disabled={item.quantity <= 1}>
											-
										</button>
										<span>{item.quantity}</span>
										<button
											onClick={() =>
												handleQuantityChange(item.cartItemId, item.quantity + 1)
											}>
											+
										</button>
									</div>
									<p>총 가격: {(item.goodsPrice * item.quantity).toLocaleString()}원</p>
								</div>
								<button
									className="remove-item-btn"
									onClick={() => handleRemoveItem(item.cartItemId)}>
									✕
								</button>
							</div>
						))}
					</div>

					{/* 총 금액 */}
					<div className="cart-total">
						<h2>총 주문 금액: {calculateTotalPrice().toLocaleString()}원</h2>
					</div>
				</>
			)}
		</div>
	);
};

export default CartComponent;
