import React, { useState } from "react";
import "../../styles/goods/GoodsDetail.scss";
import { useDispatch } from "react-redux";
import { addItemToCartAsync } from "../../slices/cartSlice";

const GoodsReadComponent = ({ goods }) => {
	const {
		goodsId, // 장바구니 추가 시 필요한 상품 ID
		goodsName,
		goodsPrice,
		goodsImgUrl,
		goodsStatus,
		goodsCategory,
		goodsStock,
	} = goods;

	const dispatch = useDispatch();
	const [quantity, setQuantity] = useState(1); // 기본 수량 1
	const [totalPrice, setTotalPrice] = useState(goodsPrice);
	const [isAdding, setIsAdding] = useState(false); // 요청 상태 관리

	// 수량 변경 시 자동으로 총 가격 계산
	const handleQuantityChange = (e) => {
		const newQuantity = Math.max(1, e.target.value); // 최소 수량 1
		setQuantity(newQuantity);
		setTotalPrice(newQuantity * goodsPrice);
	};

	// 장바구니에 추가
	const handleAddToCart = async () => {
		if (goodsStatus === "SOLD_OUT") return;

		const cartItemDTO = {
			goodsId,
			goodsName,
			goodsPrice,
			quantity,
			goodsImgUrl,
		};

		try {
			setIsAdding(true);
			const resultAction = await dispatch(
				addItemToCartAsync(cartItemDTO),
			).unwrap();
			if (resultAction) {
				alert("장바구니에 추가되었습니다.");
			}
		} catch (error) {
			alert("장바구니 추가 중 오류가 발생했습니다.");
			console.error("장바구니 추가 실패:", error);
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<div className="goods-detail-container">
			<div className="image-container">
				<img src={goodsImgUrl} alt={goodsName} className="goods-image" />
			</div>

			<div className="details">
				<div className="goods-header">
					<h1>{goodsName}</h1>
					<span className="category">
						굿즈 &gt; {goodsCategory.goodsCategoryName}
					</span>
				</div>
				<div className="price-info">
					<p className="price">{goodsPrice.toLocaleString()} 원</p>
					<label htmlFor="quantity">수량 : </label>
					<input
						type="number"
						id="quantity"
						min="1"
						max={goodsStock}
						value={quantity}
						onChange={handleQuantityChange}
						disabled={goodsStatus === "SOLD_OUT"}
					/>
					&nbsp; 개
					<div className="total-price">
						<p>총 가격: {totalPrice.toLocaleString()} 원</p>
					</div>
				</div>
				{goodsStatus === "SOLD_OUT" ? (
					<div className="sold-out-message">품절된 상품입니다</div>
				) : (
					<div className="action-buttons">
						<button
							className="add-to-cart"
							onClick={handleAddToCart}
							disabled={isAdding || goodsStatus === "SOLD_OUT"}>
							{isAdding ? "추가 중..." : "장바구니에 추가"}
						</button>
						<button className="buy-now" disabled={goodsStatus === "SOLD_OUT"}>
							바로 구매
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default GoodsReadComponent;
