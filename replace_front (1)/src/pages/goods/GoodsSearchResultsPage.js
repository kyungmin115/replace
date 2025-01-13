import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchGoods } from "../../api/goodsApi";
import GoodsCard from "../../components/goods/GoodsCard";
import PageComponent from "../../components/common/PageComponent";
import "../../styles/goods/GoodsList.scss";
import GoodsSearchBar from "../../components/goods/GoodsSearchBar";
import BasicLayout from "../../layout/BasicLayout";

const SearchResultsPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [goodsList, setGoodsList] = useState([]);
	const [serverData, setServerData] = useState({
		dtoList: [],
		pageNumList: [],
		prev: false,
		next: false,
		current: 1,
		prevPage: 0,
		nextPage: 0,
		totalCount: 0, // 총 검색 결과 개수 추가
	});
	const [fetching, setFetching] = useState(false);
	const size = 30;

	// URL에서 현재 파라미터들을 가져옴
	const query = new URLSearchParams(location.search);
	const searchType = query.get("type") || "";
	const keyword = query.get("keyword") || "";
	const pageParam = query.get("page");
	const currentPage = pageParam ? parseInt(pageParam) : 1;

	// 상품 목록 및 페이지네이션 데이터 fetching
	useEffect(() => {
		const fetchSearchResults = async () => {
			if (!keyword.trim()) return;

			try {
				setFetching(true);

				const params = {
					type: searchType,
					keyword: keyword,
					page: currentPage,
					size: size,
				};

				const response = await searchGoods(params);

				// 서버에서 totalCount 추가
				setGoodsList(response.dtoList);
				setServerData({
					dtoList: response.dtoList,
					pageNumList: response.pageNumList,
					prev: response.prev,
					next: response.next,
					current: response.current,
					prevPage: response.prevPage,
					nextPage: response.nextPage,
					totalCount: response.totalCount, // totalCount를 서버에서 받아옴
				});
			} catch (error) {
				console.error("상품 목록을 불러오는 중 오류 발생:", error);
			} finally {
				setFetching(false);
			}
		};

		fetchSearchResults();
	}, [keyword, searchType, currentPage, size]);

	// 페이지 이동 함수
	const moveToPage = (pageInfo) => {
		// URL 업데이트 - '/goods/search' 경로 유지
		navigate(
			`/goods/search?type=${searchType}&keyword=${keyword}&page=${pageInfo.page}&size=${size}`,
			{
				replace: true,
			},
		);
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
		<div
			className="goods-container"
			style={{
				paddingTop: "80px",
				textAlign: "center",
			}}>
			<BasicLayout />
			<GoodsSearchBar />

			{/* 검색된 키워드와 총 검색 결과 개수 표시 */}
			{goodsList.length > 0 ? (
				<p style={{ fontSize: "16px", color: "#333", marginBottom: "20px" }}>
					"{keyword}"에 대한 총 {serverData.totalCount}개의 검색 결과가 나왔습니다.
				</p>
			) : (
				<p style={{ fontSize: "16px", color: "#333", marginBottom: "20px" }}>
					"{keyword}"에 대한 검색된 결과가 없습니다.
				</p>
			)}

			<div className="goods-list">
				{goodsList.length === 0 ? (
					<p></p>
				) : (
					goodsList.map((good) => (
						<div key={good.goodsId} className="goods-item">
							<GoodsCard goods={good} />
						</div>
					))
				)}
			</div>

			{goodsList.length > 0 && (
				<PageComponent serverData={serverData} movePage={moveToPage} />
			)}
		</div>
	);
};

export default SearchResultsPage;
