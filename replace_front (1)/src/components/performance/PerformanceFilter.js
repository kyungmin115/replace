import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/performance/scss/PerformanceList.scss";
import { Search } from "lucide-react";

const PerformanceFilter = ({
	genres,
	areas,
	selectedGenres,
	selectedAreas,
	keyword,
	onGenreSelect,
	onAreaSelect,
	onKeywordSearch,
}) => {
	const [localKeyword, setLocalKeyword] = useState(keyword);
	const [isSearched, setIsSearched] = useState(false); // 검색 여부 상태
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const navigate = useNavigate();

	const handleKeywordSubmit = (e) => {
		e.preventDefault();
		onKeywordSearch(localKeyword);
		setIsSearched(true); // 검색 시 상태를 true로 설정
	};

	const handleBackToList = () => {
		setLocalKeyword(""); // 검색창 내용 비우기
		setIsSearched(false); // 검색 여부 상태 초기화
		navigate("/performances"); // 목록으로 돌아가기
	};

	return (
		<>
			<form onSubmit={handleKeywordSubmit} className="performance-search-bar">
				<div className="performance-search-container">
					<div className="performance-input-wrapper">
						<input
							type="text"
							placeholder="공연 제목으로 검색"
							value={localKeyword}
							ref={inputRef}
							onChange={(e) => setLocalKeyword(e.target.value)}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							className="performance-search-input"
						/>
						<div className={`performance-focus-line ${isFocused ? "focused" : ""}`} />
					</div>
					<button type="submit" className="performance-icon-button">
						<Search className="w-5 h-5" />
					</button>
				</div>
			</form>

			{/* 검색 후 장르와 지역 필터 숨기기 */}
			{!isSearched && (
				<>
					<div className="genre-filter">
						<div className="genre-tabs">
							<button
								onClick={() => onGenreSelect("")}
								className={`genre-tab ${selectedGenres.length === 0 ? "active" : ""}`}>
								전체
							</button>
							{genres.map((genre) => (
								<button
									key={genre}
									onClick={() => onGenreSelect(genre)}
									className={`genre-tab ${
										selectedGenres.includes(genre) ? "active" : ""
									}`}>
									{genre}
								</button>
							))}
						</div>
					</div>

					<div className="area-filter">
						<div className="area-tabs">
							<button
								onClick={() => onAreaSelect("")}
								className={`area-tab ${selectedAreas.length === 0 ? "active" : ""}`}>
								전체
							</button>
							{areas.map((area) => (
								<button
									key={area}
									onClick={() => onAreaSelect(area)}
									className={`area-tab ${selectedAreas.includes(area) ? "active" : ""}`}>
									{area}
								</button>
							))}
						</div>
					</div>
				</>
			)}

			{/* 목록으로 돌아가기 버튼 (조건부 렌더링) */}
			{isSearched && (
				<div
					className="back-to-list"
					style={{ marginTop: "20px", textAlign: "center" }}>
					<button
						onClick={handleBackToList} // 클릭 시 검색창 비우고 목록으로 돌아가기
						style={{
							padding: "10px 20px",
							backgroundColor: "#007bff",
							color: "white",
							border: "none",
							borderRadius: "5px",
							cursor: "pointer",
						}}>
						목록으로 돌아가기
					</button>
				</div>
			)}
		</>
	);
};

export default PerformanceFilter;
