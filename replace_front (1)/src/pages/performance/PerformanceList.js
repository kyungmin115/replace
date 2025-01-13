import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Heart } from "lucide-react";
import BasicLayout from "../../layout/BasicLayout";
import "./scss/PerformanceList.scss";
import PerformanceFilter from "../../components/performance/PerformanceFilter";
import PerformancePagination from "../../components/performance/PerformancePagination";
import useCustomLogin from "../../hooks/useCustomLogin";
import {
	addToWishList,
	isInWishList,
	removeFromWishList,
} from "../../api/wishListApi";

const BASE_URL = "http://localhost:8080";

const PerformanceList = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { isLogin, moveToLogin } = useCustomLogin();

	// State 관리
	const [performances, setPerformances] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [size] = useState(9);
	const [genres, setGenres] = useState([]);
	const [areas, setAreas] = useState([]);
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [selectedAreas, setSelectedAreas] = useState([]);
	const [keyword, setKeyword] = useState("");
	const [wishlistMap, setWishlistMap] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	// axios.interceptors.request.use(
	// 	(config) => {
	// 		const token = localStorage.getItem("token");
	// 		if (token) {
	// 			config.headers.Authorization = `Bearer ${token}`;
	// 		}
	// 		config.withCredentials = true;
	// 		return config;
	// 	},
	// 	(error) => {
	// 		return Promise.reject(error);
	// 	},
	// );

	// useEffect(() => {
	// 	checkLoginStatus();
	// }, []);

	// 초기 데이터 로딩
	useEffect(() => {
		const initializeData = async () => {
			try {
				// const token = localStorage.getItem("token");
				// setIsLoggedIn(!!token);

				const pageFromURL = parseInt(searchParams.get("page") || "1", 10);
				const genresFromURL = searchParams.get("genre")?.split(",") || [];
				const areasFromURL = searchParams.get("area")?.split(",") || [];
				const keywordFromURL = searchParams.get("keyword") || "";

				setCurrentPage(pageFromURL);
				setSelectedGenres(genresFromURL);
				setSelectedAreas(areasFromURL);
				setKeyword(keywordFromURL);

				await Promise.all([
					fetchPerformances(
						pageFromURL,
						genresFromURL,
						areasFromURL,
						keywordFromURL,
					),
					fetchGenres(),
					fetchAreas(),
				]);
			} catch (error) {
				console.error("초기 데이터 로딩 중 오류 발생:", error);
			} finally {
				setIsLoading(false);
			}
		};

		initializeData();
	}, [searchParams]);

	// // isLoggedIn 상태 체크 함수를 별도로 분리
	// // 토큰 유효성 확인 함수 수정
	// const checkLoginStatus = () => {
	// 	const token = localStorage.getItem("token");
	// 	if (!token) {
	// 		setIsLoggedIn(false);
	// 		return false;
	// 	}
	// 	// 토큰이 존재하면 로그인 상태로 간주
	// 	setIsLoggedIn(true);
	// 	return true;
	// };

	// 찜 상태 확인
	useEffect(() => {
		const checkWishlistStatus = async () => {
			if (!isLogin || performances.length === 0) return;

			try {
				// const promises = performances.map((performance) =>
				// 	axios.get(`${BASE_URL}/api/wishlist/check/${performance.pid}`, {
				// 		headers: {
				// 			Authorization: `Bearer ${token}`,
				// 			"Content-Type": "application/json",
				// 		},
				// 	}),
				// );

				// const responses = await Promise.all(promises);
				// const newWishlistMap = {};
				// responses.forEach((response, index) => {
				// 	newWishlistMap[performances[index].pid] = response.data;
				// });
				// setWishlistMap(newWishlistMap);
				const newWishlistMap = {};
				for (const performance of performances) {
					const isWishlisted = await isInWishList(performance.pid);
					newWishlistMap[performance.pid] = isWishlisted;
				}
				setWishlistMap(newWishlistMap);
			} catch (error) {
				console.error("찜 상태 확인 중 오류 발생:", error);
				if (error.response?.status === 401) {
					alert("로그인이 필요하거나 세션이 만료되었습니다.");
					moveToLogin();
				}
			}
		};

		checkWishlistStatus();
	}, [performances]);

	// API 호출 함수들
	const fetchPerformances = async (page, genres, areas, keyword) => {
		try {
			const genreParam =
				genres.length > 0 ? `&genres=${encodeURIComponent(genres.join(","))}` : "";
			const areaParam =
				areas.length > 0 ? `&areas=${encodeURIComponent(areas.join(","))}` : "";
			const keywordParam = keyword
				? `&keyword=${encodeURIComponent(keyword)}`
				: "";

			const response = await axios.get(
				`${BASE_URL}/api/performances?page=${
					page - 1
				}&size=${size}${genreParam}${areaParam}${keywordParam}`,
				{ withCredentials: true },
			);

			setPerformances(response.data.content);
			setTotalPages(response.data.totalPages);
		} catch (error) {
			console.error("공연 정보를 가져오는 중 오류가 발생했습니다.", error);
		}
	};

	const fetchGenres = async () => {
		try {
			const response = await axios.get(`${BASE_URL}/api/performances/genres`);
			setGenres(response.data);
		} catch (error) {
			console.error("장르 정보를 가져오는 중 오류가 발생했습니다.", error);
		}
	};

	const fetchAreas = async () => {
		try {
			const response = await axios.get(`${BASE_URL}/api/performances/areas`);
			setAreas(response.data);
		} catch (error) {
			console.error("지역 정보를 가져오는 중 오류가 발생했습니다.", error);
		}
	};

	// 이벤트 핸들러

	// handleWishClick 함수 수정
	const handleWishClick = async (performanceId) => {
		if (!isLogin) {
			alert("로그인이 필요한 서비스입니다.");
			moveToLogin();
			return;
		}

		try {
			const isCurrentlyWishlisted = wishlistMap[performanceId];
			if (isCurrentlyWishlisted) {
				await removeFromWishList(performanceId); // 찜 목록에서 삭제
			} else {
				await addToWishList(performanceId); // 찜 목록에 추가
			}

			// 찜 상태 업데이트
			setWishlistMap((prev) => ({
				...prev,
				[performanceId]: !prev[performanceId],
			}));
		} catch (error) {
			console.error("찜하기 처리 중 오류 발생:", error);
			alert("찜하기 처리 중 오류가 발생했습니다.");
		}
	};

	const handleGenreSelect = (genre) => {
		const updatedGenres =
			selectedGenres.length === 1 && selectedGenres[0] === genre
				? []
				: selectedGenres.includes(genre)
				? selectedGenres.filter((g) => g !== genre)
				: [genre];

		updateSearchParams(1, updatedGenres, selectedAreas, keyword);
	};

	const handleAreaSelect = (area) => {
		const updatedAreas =
			selectedAreas.length === 1 && selectedAreas[0] === area
				? []
				: selectedAreas.includes(area)
				? selectedAreas.filter((a) => a !== area)
				: [area];

		updateSearchParams(1, selectedGenres, updatedAreas, keyword);
	};

	const handleKeywordSearch = (newKeyword) => {
		updateSearchParams(1, selectedGenres, selectedAreas, newKeyword);
	};

	const handlePageChange = (page) => {
		updateSearchParams(page, selectedGenres, selectedAreas, keyword);
	};

	const updateSearchParams = (page, genres, areas, searchKeyword) => {
		const params = {
			page: page.toString(),
			...(genres.length && { genre: genres.join(",") }),
			...(areas.length && { area: areas.join(",") }),
			...(searchKeyword && { keyword: searchKeyword }),
		};
		setSearchParams(params);
	};

	if (isLoading) {
		return <div className="loading">Loading...</div>;
	}

	// 날짜 포맷팅 함수
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
			2,
			"0",
		)}월 ${String(date.getDate()).padStart(2, "0")}일`;
	};

	return (
		<div>
			<BasicLayout />
			<div className="container">
				<PerformanceFilter
					genres={genres}
					areas={areas}
					selectedGenres={selectedGenres}
					selectedAreas={selectedAreas}
					keyword={keyword}
					onGenreSelect={handleGenreSelect}
					onAreaSelect={handleAreaSelect}
					onKeywordSearch={handleKeywordSearch}
				/>
				<hr />
				<div className="performance-grid">
					{performances.length > 0 ? (
						performances.map((performance) => (
							<div key={performance.pid} className="performance-card">
								<div className="image-container">
									<Link to={`/performances/${performance.pid}`}>
										<img
											src={performance.posterUrl}
											alt={performance.pname}
											className="performance-image"
										/>
									</Link>
									<button
										className="wish-button"
										onClick={() => handleWishClick(performance.pid)}>
										<Heart
											className={`heart-icon ${
												wishlistMap[performance.pid] ? "active" : ""
											}`}
											style={{
												fill: wishlistMap[performance.pid] ? "#ff0000" : "none",
												stroke: wishlistMap[performance.pid] ? "#ff0000" : "currentColor",
											}}
										/>
									</button>
								</div>
								<div className="performance-info">
									<h3>
										<Link
											to={`/performances/${performance.pid}`}
											className="performance-title-link">
											{performance.pname}
										</Link>
									</h3>
									<p className="genre">{performance.genre}</p>
									<p className="date">
										{formatDate(performance.startDate)} -{" "}
										{formatDate(performance.endDate)}
									</p>
									<p className="venue">{performance.fname}</p>
								</div>
							</div>
						))
					) : (
						<div className="no-data">검색 결과가 없습니다.</div>
					)}
				</div>
				<PerformancePagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			</div>
		</div>
	);
};

export default PerformanceList;
