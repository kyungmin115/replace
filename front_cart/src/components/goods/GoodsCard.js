import React from "react";
import "../../styles/goods/GoodsCard.scss";
import { Link } from "react-router-dom";

// 상품 이미지 컴포넌트
const ProductImage = ({ goodsImgUrl, goodsName }) => {
	return (
		<span className="ProductThumbnail" style={{ backgroundColor: "#f6f6f6" }}>
			<img className="image" src={goodsImgUrl} alt={goodsName} />
		</span>
	);
};

// 품절 배지 컴포넌트
const ProductBadge = ({ goodsStatus }) => {
	return (
		<div className="ProductBadgeList badge-container">
			{goodsStatus === "SOLD_OUT" && (
				<span className="ProductBadge sold_out__badge">
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
			<a href={`/kr/bdemgmr`} className="ProductStoreName">
				{storeName}
			</a>
		</div>
	);
};

// 상품 가격 컴포넌트
const ProductPrice = ({ goodsPrice }) => {
	return (
		<div className="ProductCardPrice">
			<span className="price-number">{goodsPrice.toLocaleString()}</span>
			<span>원</span>
		</div>
	);
};

// 상품 이름 컴포넌트
const ProductName = ({ goodsName }) => {
	return <a className="ProductCardName">{goodsName}</a>;
};

// 상품 정보 컴포넌트
const ProductInfo = ({ storeName, goodsName, goodsPrice }) => {
	return (
		<div className="info">
			<StoreInfo storeName={storeName} />
			<ProductName goodsName={goodsName} />
			<ProductPrice goodsPrice={goodsPrice} />
		</div>
	);
};

// 메인 GoodsCard 컴포넌트
const GoodsCard = ({ goods }) => {
	const { goodsId, goodsName, goodsPrice, goodsImgUrl, goodsStatus, storeName } =
		goods;

	return (
		<div className="ProductCard product_card">
			<Link to={`/goods/${goodsId}`}>
				{" "}
				{/* 상품 상세 페이지로 이동 */}
				<a className="thumbnail-container">
					{/* 품절 배지 및 상품 이미지 */}
					<div className="image-container">
						<ProductBadge goodsStatus={goodsStatus} />
						<ProductImage goodsImgUrl={goodsImgUrl} goodsName={goodsName} />
					</div>
				</a>
				{/* 상품 정보 */}
				<ProductInfo
					storeName={storeName}
					goodsName={goodsName}
					goodsPrice={goodsPrice}
				/>
			</Link>
		</div>
	);
};

export default GoodsCard;
