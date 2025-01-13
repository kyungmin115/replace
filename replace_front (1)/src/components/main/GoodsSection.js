import React, { useState, useEffect } from "react";
import { getGoodsList } from "../../api/goodsApi";
import { Link } from "react-router-dom";
import "./GoodsSection.scss";

// Existing subcomponents remain the same
const ProductImage = ({ goodsImgUrl, goodsName }) => {
	return (
		<span className="ProductThumbnail" style={{ backgroundColor: "#f6f6f6" }}>
			<img className="image" src={goodsImgUrl} alt={goodsName} />
		</span>
	);
};

const ProductBadge = ({ goodsStatus, rank }) => {
	return (
		<div className="ProductBadgeList badge-container">
			<span className="ranking-badge">
				<span>{rank}</span>
			</span>
			{goodsStatus === "SOLD_OUT" && (
				<span className="ProductBadge sold_out__badge">
					<span>Sold out</span>
				</span>
			)}
		</div>
	);
};

const StoreInfo = ({ storeName }) => {
	return (
		<div className="store-name-container">
			<span className="ProductStoreName">{storeName}</span>
		</div>
	);
};

const ProductPrice = ({ goodsPrice }) => {
	return (
		<div className="ProductCardPrice">
			<span className="price-number">{goodsPrice.toLocaleString()}</span>
			<span>원</span>
		</div>
	);
};

const ProductName = ({ goodsName }) => {
	return <span className="ProductCardName">{goodsName}</span>;
};

const ProductInfo = ({ storeName, goodsName, goodsPrice }) => {
	return (
		<div className="info">
			<StoreInfo storeName={storeName} />
			<ProductName goodsName={goodsName} />
			<ProductPrice goodsPrice={goodsPrice} />
		</div>
	);
};

const GoodsSection = () => {
	const [goodsList, setGoodsList] = useState([]);
	const [fetching, setFetching] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const size = 4;
	const additionalSize = 8;
	const maxGoodsCount = 100;

	const fetchGoods = async (page, pageSize) => {
		if (fetching || goodsList.length >= maxGoodsCount) return;

		try {
			setFetching(true);
			// pageParam 객체 생성
			const pageParam = {
				page: page,
				size: pageSize,
			};

			// API 호출 시 매개변수 순서 맞추기
			const response = await getGoodsList(pageParam, null, null, "views");

			setGoodsList((prevGoods) => [...prevGoods, ...response.dtoList]);

			if (
				goodsList.length >= maxGoodsCount ||
				response.dtoList.length < pageSize
			) {
				setHasMore(false);
			}
		} catch (error) {
			console.error("상품 목록을 불러오는 중 오류 발생:", error);
		} finally {
			setFetching(false);
		}
	};

	useEffect(() => {
		fetchGoods(currentPage, size);
	}, []);

	const [showScrollToTop, setShowScrollToTop] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop >=
				document.documentElement.offsetHeight - 300
			) {
				if (hasMore && !fetching) {
					setCurrentPage((prevPage) => {
						const nextPage = prevPage + 1;
						fetchGoods(nextPage, additionalSize);
						return nextPage;
					});
				}
			}

			setShowScrollToTop(window.scrollY > 1000);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetching, hasMore]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<div className="goods-section-container">
			<div className="goods-section-header">
				<h2 className="goods-section-h2">GOODS BEST</h2>
				<Link to="/goods/list" className="go-to-goods-list-button">
					See More
				</Link>
			</div>

			<div className="goods-section-list">
				{goodsList.length === 0 ? (
					<p className="no-items">상품 목록이 없습니다.</p>
				) : (
					goodsList.map((goods, index) => {
						const {
							goodsId,
							goodsName,
							goodsPrice,
							goodsImgUrl,
							goodsStatus,
							storeName,
						} = goods;

						const isSoldOut = goodsStatus === "SOLD_OUT";
						const rank = index + 1; // 랭킹 계산

						return (
							<div key={goodsId} className="product-card-container">
								<div className={`ProductCard ${isSoldOut ? "sold-out" : ""}`}>
									<Link to={`/goods/${goodsId}`}>
										<div className="thumbnail-container">
											<ProductImage goodsImgUrl={goodsImgUrl} goodsName={goodsName} />
											<ProductBadge goodsStatus={goodsStatus} rank={rank} />
										</div>
										<div className="product-info">
											<ProductInfo
												storeName={storeName}
												goodsName={goodsName}
												goodsPrice={goodsPrice}
											/>
										</div>
									</Link>
								</div>
							</div>
						);
					})
				)}
			</div>

			{fetching && <div className="loading-container">로딩 중...</div>}

			{showScrollToTop && (
				<button onClick={scrollToTop} className="scroll-to-top-button">
					↑
				</button>
			)}
		</div>
	);
};

export default GoodsSection;
