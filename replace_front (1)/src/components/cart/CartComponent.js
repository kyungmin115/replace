import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	updateCartItemSelectionAsync,
	updateCartItemQuantityAsync,
	removeItemFromCartAsync,
	removeSelectedItemsAsync,
	selectAllCartItemsAsync,
} from "../../slices/cartSlice";
import { processPayment } from "../../api/paymentApi";
import CustomModal from "../common/CustomModal";
import useCustomLogin from "../../hooks/useCustomLogin";
import "../../styles/cart/CartPage.scss";

const CartComponent = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loginState } = useCustomLogin();
	const { items, selectAll } = useSelector((state) => state.cart);
	const [isPaying, setIsPaying] = useState(false);
	const [paymentData, setPaymentData] = useState(null);
	const [modalState, setModalState] = useState({
		payment: false,
		paymentSuccess: false,
	});

	const cartItemsList = items?.[0]?.cartItemDTOList || [];

	// IMP 초기화
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://cdn.iamport.kr/v1/iamport.js";
		script.async = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	// 모달 컨트롤
	const openModal = (modalType) => {
		setModalState((prev) => ({ ...prev, [modalType]: true }));
	};

	const closeModal = (modalType) => {
		setModalState((prev) => ({ ...prev, [modalType]: false }));
	};

	// 현재 모든 아이템의 선택 상태를 확인하여 selectAll 상태만 업데이트
	useEffect(() => {
		if (cartItemsList.length > 0) {
			const allSelected = cartItemsList.every((item) => item.selected);
			if (allSelected !== selectAll) {
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

	// 선택된 상품들 가져오기
	const getSelectedItems = () => {
		return cartItemsList.filter((item) => item.selected);
	};

	// 결제 후 장바구니에서 제거
	const removePayedItemsFromCart = async () => {
		try {
			// 선택된 아이템들 삭제
			await dispatch(removeSelectedItemsAsync()).unwrap();
		} catch (error) {
			console.error("장바구니 아이템 삭제 중 오류 발생:", error);
		}
	};

	const handlePaymentComplete = () => {
		closeModal("paymentSuccess");

		// 결제 완료된 상품들 장바구니에서 제거
		removePayedItemsFromCart();

		navigate("/payment/complete", {
			replace: true,
			state: {
				paymentInfo: paymentData,
			},
		});
	};

	// 결제 처리
	const handlePayment = async () => {
		const selectedItems = getSelectedItems();
		if (selectedItems.length === 0) {
			alert("주문할 상품을 선택해주세요.");
			return;
		}

		setIsPaying(true);
		const IMP = window.IMP;
		IMP.init("");

		const totalAmount = calculateTotalPrice();
		const merchantUid = `cart_${new Date().getTime()}`;

		// 상품명 생성 (첫 상품명 + 추가 상품 개수)
		const itemNames = selectedItems.map((item) => item.goodsName);
		const paymentName =
			itemNames.length > 1
				? `${itemNames[0]} 외 ${itemNames.length - 1}개`
				: itemNames[0];

		const data = {
			pg: "kakaopay",
			pay_method: "card",
			merchant_uid: merchantUid,
			name: paymentName,
			amount: totalAmount,
			buyer_email: loginState.email,
			buyer_name: loginState.id,
			buyer_tel: loginState.phone,
		};

		try {
			IMP.request_pay(data, async function (rsp) {
				if (rsp.success) {
					try {
						// 결제 정보 서버로 전송
						const paymentResult = await processPayment({
							impUid: rsp.imp_uid,
							merchantUid: rsp.merchant_uid,
							amount: rsp.paid_amount,
							memberId: loginState.id,
						});

						console.log("결제 처리 성공:", paymentResult);

						// 결제 데이터 저장
						const paymentInfo = {
							type: "goods",
							name: paymentName,
							amount: totalAmount,
							orderDate: new Date().toLocaleDateString(),
							orderId: merchantUid,
							buyerName: loginState.id,
							buyerEmail: loginState.email,
						};
						setPaymentData(paymentInfo);

						// 결제 성공 모달 표시
						openModal("paymentSuccess");
					} catch (error) {
						console.error("결제 처리 중 오류 발생:", error);
						alert("결제 처리 중 오류가 발생했습니다.");
					}
				} else {
					alert(`결제에 실패하였습니다. ${rsp.error_msg}`);
				}
				setIsPaying(false);
			});
		} catch (error) {
			console.error("결제 요청 중 오류 발생:", error);
			alert("결제 요청 중 오류가 발생했습니다.");
			setIsPaying(false);
		}
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
				<div className="empty-cart">
					<p>장바구니가 비어 있어요!</p>
					<Link to="/goods/list" className="go-shopping-link">
						굿즈 구경하러 가기
					</Link>
				</div>
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

					{/* 주문 버튼 */}
					<div className="cart-summary">
						<button
							onClick={handlePayment}
							disabled={
								cartItemsList.filter((item) => item.selected).length === 0 || isPaying
							}
							className="order-button">
							{isPaying ? "결제 처리 중..." : "주문하기"}
						</button>
					</div>

					{/* 결제 성공 모달 */}
					<CustomModal
						isOpen={modalState.paymentSuccess}
						onClose={() => closeModal("paymentSuccess")}
						title="결제 완료"
						buttons={
							<button onClick={handlePaymentComplete} className="confirm-btn">
								확인
							</button>
						}>
						<p>결제가 성공적으로 완료되었습니다!</p>
					</CustomModal>
				</>
			)}
		</div>
	);
};

export default CartComponent;
