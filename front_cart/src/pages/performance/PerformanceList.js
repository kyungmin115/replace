import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import BasicLayout from "../../layout/BasicLayout";
import "./scss/PerformanceList.scss";

import PerformanceFilter from "../../components/performance/PerformanceFilter";
import PerformanceGrid from "../../components/performance/PerformanceGrid";
import PerformancePagination from "../../components/performance/PerformancePagination";

const PerformanceList = () => {
	const [performances, setPerformances] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [size] = useState(15);
	const [currentPage, setCurrentPage] = useState(1);
	const [genres, setGenres] = useState([]);
	const [areas, setAreas] = useState([]);
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [selectedAreas, setSelectedAreas] = useState([]);
	const [keyword, setKeyword] = useState("");
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const pageFromURL = parseInt(searchParams.get("page") || "1", 10);
		const genresFromURL = searchParams.get("genre")?.split(",") || [];
		const areasFromURL = searchParams.get("area")?.split(",") || [];
		const keywordFromURL = searchParams.get("keyword") || "";

		setCurrentPage(pageFromURL);
		setSelectedGenres(genresFromURL);
		setSelectedAreas(areasFromURL);
		setKeyword(keywordFromURL);

		fetchPerformances(pageFromURL, genresFromURL, areasFromURL, keywordFromURL);
		fetchGenres();
		fetchAreas();
	}, [searchParams]);

	const fetchPerformances = (page, genres, areas, keyword) => {
		const genreParam =
			genres.length > 0 ? `&genres=${encodeURIComponent(genres.join(","))}` : "";
		const areaParam =
			areas.length > 0 ? `&areas=${encodeURIComponent(areas.join(","))}` : "";
		const keywordParam = keyword ? `&keyword=${encodeURIComponent(keyword)}` : "";
		const url = `http://localhost:8080/api/performances?page=${
			page - 1
		}&size=${size}${genreParam}${areaParam}${keywordParam}`;

		axios
			.get(url, { withCredentials: true })
			.then((response) => {
				const data = response.data;
				setPerformances(data.content);
				setTotalPages(data.totalPages);
			})
			.catch((error) => {
				console.error("공연 정보를 가져오는 중 오류가 발생했습니다.", error);
			});
	};

	const fetchGenres = () => {
		axios
			.get("http://localhost:8080/api/performances/genres")
			.then((response) => {
				setGenres(response.data);
			})
			.catch((error) => {
				console.error("장르 정보를 가져오는 중 오류가 발생했습니다.", error);
			});
	};

	const fetchAreas = () => {
		axios
			.get("http://localhost:8080/api/performances/areas")
			.then((response) => {
				setAreas(response.data);
			})
			.catch((error) => {
				console.error("지역 정보를 가져오는 중 오류가 발생했습니다.", error);
			});
	};

	const handleGenreSelect = (genre) => {
		let updatedGenres;
		if (selectedGenres.length === 1 && selectedGenres[0] === genre) {
			updatedGenres = [];
		} else if (selectedGenres.includes(genre)) {
			updatedGenres = selectedGenres.filter((g) => g !== genre);
		} else {
			updatedGenres = [genre];
		}
		setSelectedGenres(updatedGenres);
		setCurrentPage(1);
		setSearchParams({
			page: 1,
			genre: updatedGenres.join(","),
			area: selectedAreas.join(","),
			keyword: keyword,
		});
	};

	const handleAreaSelect = (area) => {
		let updatedAreas;
		if (selectedAreas.length === 1 && selectedAreas[0] === area) {
			updatedAreas = [];
		} else if (selectedAreas.includes(area)) {
			updatedAreas = selectedAreas.filter((a) => a !== area);
		} else {
			updatedAreas = [area];
		}
		setSelectedAreas(updatedAreas);
		setCurrentPage(1);
		setSearchParams({
			page: 1,
			genre: selectedGenres.join(","),
			area: updatedAreas.join(","),
			keyword: keyword,
		});
	};

	const handleKeywordSearch = (newKeyword) => {
		setKeyword(newKeyword);
		setCurrentPage(1);
		setSearchParams({
			page: 1,
			genre: selectedGenres.join(","),
			area: selectedAreas.join(","),
			keyword: newKeyword,
		});
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
		setSearchParams({
			page,
			genre: selectedGenres.join(","),
			area: selectedAreas.join(","),
			keyword: keyword,
		});
	};

	return (
		<div>
			<BasicLayout />
			<div className="container">
				<h1>공연 목록</h1>
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
				<PerformanceGrid
					performances={performances}
					selectedGenres={selectedGenres}
					selectedAreas={selectedAreas}
				/>
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
