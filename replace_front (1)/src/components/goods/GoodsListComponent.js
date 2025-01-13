import React, { useState, useEffect } from "react";
import { getGoodsCategories, getGoodsList } from "../../api/goodsApi";
import GoodsCard from "../goods/GoodsCard";
import PageComponent from "../common/PageComponent";
import "../../styles/goods/GoodsList.scss";
import { useLocation, useNavigate } from "react-router-dom";
import GoodsSearchBar from "./GoodsSearchBar";

const GoodsListComponent = () => {
	const [categories, setCategories] = useState([]); // 카테고리 리스트
	const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리
	const [goodsList, setGoodsList] = useState([]); // 상품 리스트
	const [serverData, setServerData] = useState({
		dtoList: [],
		pageNumList: [],
		prev: false,
		next: false,
		current: 1,
		prevPage: 0,
		nextPage: 0,
	});
	const [fetching, setFetching] = useState(false); // 로딩 상태
	const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
	const [goodsStatus, setGoodsStatus] = useState("");
	const [sortOrder, setSortOrder] = useState(""); // 정렬 기준
	const size = 30; // 페이지 크기 (고정)

	const location = useLocation();
	const navigate = useNavigate();

	// 카테고리 데이터 가져오기
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const categoryData = await getGoodsCategories();
				setCategories([
					{ goodsCategoryId: null, goodsCategoryName: "전체" },
					...categoryData,
				]); // "전체" 버튼 추가
			} catch (error) {
				console.error("카테고리 데이터를 불러오는 중 오류 발생:", error);
			}
		};

		fetchCategories();
	}, []);

	// URL 쿼리 파라미터 처리 (페이지 및 카테고리)
	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const pageParam = parseInt(queryParams.get("page")) || 1;
		const categoryParam = queryParams.get("category");
		const statusParam = queryParams.get("goodsStatus") || "";
		const sortParam = queryParams.get("sortOrder") || "";

		setCurrentPage(pageParam); // 페이지 파라미터 설정
		setSelectedCategory(categoryParam ? parseInt(categoryParam) : null); // 카테고리 파라미터 설정
		setGoodsStatus(statusParam); // 상태 필터 설정
		setSortOrder(sortParam); // 정렬 설정
	}, [location.search]);

	// 상품 목록 및 페이지네이션 데이터 fetching
	useEffect(() => {
		const fetchGoods = async () => {
			try {
				setFetching(true);

				const response = await getGoodsList(
					{
						page: currentPage,
						size: size,
					},
					selectedCategory,
					goodsStatus,
					sortOrder,
				);

				setGoodsList(response.dtoList);
				setServerData({
					dtoList: response.dtoList,
					pageNumList: response.pageNumList,
					prev: response.prev,
					next: response.next,
					current: response.current,
					prevPage: response.prevPage,
					nextPage: response.nextPage,
					totalPage: response.totalPage,
				});

				updateURLParams();
			} catch (error) {
				console.error("상품 목록을 불러오는 중 오류 발생:", error);
			} finally {
				setFetching(false);
			}
		};

		fetchGoods();
	}, [currentPage, selectedCategory, goodsStatus, sortOrder]); // searchQuery가 변할 때마다 호출

	// URL 쿼리 파라미터 업데이트 함수
	const updateURLParams = () => {
		const categoryQuery = selectedCategory ? `&category=${selectedCategory}` : "";
		const statusQuery = goodsStatus ? `&goodsStatus=${goodsStatus}` : "";
		const sortQuery = sortOrder ? `&sortOrder=${sortOrder}` : "";

		navigate(
			`/goods/list?page=${currentPage}&size=${size}${categoryQuery}${statusQuery}${sortQuery}`,
			{
				replace: true,
			},
		);
	};

	// 페이지 이동 함수
	const moveToPage = (pageInfo) => {
		const newPage = pageInfo.page;
		setCurrentPage(newPage);
	};

	// 카테고리 선택 처리
	const handleCategoryClick = (categoryId) => {
		setSelectedCategory(categoryId);
		setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 이동
	};

	// 상태 변경 (품절 상품 제외 체크박스)
	const handleStatusChange = (e) => {
		setGoodsStatus(e.target.checked ? "AVAILABLE" : ""); // 체크박스 상태에 따라 'AVAILABLE'만 필터링
		setCurrentPage(1); // 상태 변경 시 첫 페이지로 이동
	};

	// 정렬 옵션 변경
	const handleSortOrderChange = (e) => {
		setSortOrder(e.target.value);
		setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
	};

	// 로딩 상태 표시
	if (fetching) {
		return (
			<div className="loading-container">
				<p>상품을 불러오는 중...</p>
			</div>
		);
	}

	return (
		<div className="goods-container">
			<GoodsSearchBar />

			{/* 카테고리 버튼 */}
			<div className="category-buttons">
				{categories.map((category) => (
					<button
						key={category.goodsCategoryId}
						className={`category-button ${
							selectedCategory === category.goodsCategoryId ? "active" : ""
						}`}
						onClick={() => handleCategoryClick(category.goodsCategoryId)}>
						{category.goodsCategoryName}
					</button>
				))}
			</div>

			{/* 품절 상품 제외 체크박스 */}
			<div className="filters-container">
				<div className="status-filter">
					<label>
						<input
							type="checkbox"
							checked={goodsStatus === "AVAILABLE"}
							onChange={handleStatusChange}
						/>
						품절 상품 제외
					</label>
				</div>

				<div className="sort-filter">
					<select value={sortOrder} onChange={handleSortOrderChange}>
						<option value="newest">최신순</option>
						<option value="priceAsc">가격 낮은 순</option>
						<option value="priceDesc">가격 높은 순</option>
						<option value="views">조회수 순</option>
					</select>
				</div>
			</div>

			{/* 상품 목록 */}
			<div className="goods-list">
				{goodsList.length === 0 ? (
					<p className="no-items">상품 목록이 없습니다.</p>
				) : (
					goodsList.map((goods) => (
						<div key={goods.goodsId} className="goods-item">
							<GoodsCard goods={goods} />
						</div>
					))
				)}
			</div>

			{/* 페이지네이션 */}
			{goodsList.length > 0 && (
				<PageComponent serverData={serverData} movePage={moveToPage} />
			)}
		</div>
	);
};

export default GoodsListComponent;
