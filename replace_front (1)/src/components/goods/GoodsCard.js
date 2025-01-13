import React from "react";
import "../../styles/goods/GoodsCard.scss";
import { Link } from "react-router-dom";

// 상품 이미지 컴포넌트
const GoodsImage = ({ goodsImgUrl, goodsName }) => {
	return (
		<span className="GoodsThumbnail" style={{ backgroundColor: "#f6f6f6" }}>
			<img className="GoodsImage" src={goodsImgUrl} alt={goodsName} />
		</span>
	);
};

// 품절 배지 컴포넌트
const GoodsBadge = ({ goodsStatus }) => {
	return (
		<div className="GoodsBadgeList badge-container">
			{goodsStatus === "SOLD_OUT" && (
				<span className="GoodsBadge sold_out_badge">
					<span>Sold out</span>
				</span>
			)}
		</div>
	);
};

// 판매자 정보 컴포넌트
const StoreInfo = ({ storeName }) => {
	return (
		<div className="store-name-container">
			<span className="GoodsStoreName">{storeName}</span>
		</div>
	);
};

// 상품 가격 컴포넌트
const GoodsPrice = ({ goodsPrice }) => {
	return (
		<div className="GoodsCardPrice">
			<span className="price-number">{goodsPrice.toLocaleString()}</span>
			<span>원</span>
		</div>
	);
};

// 상품 이름 컴포넌트
const GoodsName = ({ goodsName }) => {
	return <span className="GoodsCardName">{goodsName}</span>;
};

// 상품 정보 컴포넌트
const GoodsInfo = ({ storeName, goodsName, goodsPrice }) => {
	return (
		<div className="GoodsInfo">
			<StoreInfo storeName={storeName} />
			<GoodsName goodsName={goodsName} />
			<GoodsPrice goodsPrice={goodsPrice} />
		</div>
	);
};

// 메인 GoodsCard 컴포넌트
const GoodsCard = ({ goods }) => {
	const { goodsId, goodsName, goodsPrice, goodsImgUrl, goodsStatus, storeName } =
		goods;

	const isSoldOut = goodsStatus === "SOLD_OUT";

	return (
		<div className={`GoodsCard ${isSoldOut ? "sold-out" : ""}`}>
			<Link to={`/goods/${goodsId}`}>
				{/* 상품 상세 페이지로 이동 */}
				<div className="Goods_thumbnail-container">
					{/* 품절 배지 및 상품 이미지 */}
					<div className="Goods_image-container">
						<GoodsBadge goodsStatus={goodsStatus} />
						<GoodsImage goodsImgUrl={goodsImgUrl} goodsName={goodsName} />
					</div>
				</div>
				{/* 상품 정보 */}
				<GoodsInfo
					storeName={storeName}
					goodsName={goodsName}
					goodsPrice={goodsPrice}
				/>
			</Link>
		</div>
	);
};

export default GoodsCard;
