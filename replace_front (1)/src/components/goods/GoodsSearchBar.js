import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Image } from "lucide-react";
import ImageClassifier from "../../components/ImageClassifier";
import "../../styles/goods/GoodsSearchBar.scss";

const GoodsSearchBar = () => {
	const navigate = useNavigate();
	const [searchType, setSearchType] = useState("gs");
	const [keyword, setKeyword] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태
	const inputRef = useRef(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const handleSearch = (e) => {
		e.preventDefault();
		if (!keyword.trim()) return;

		const searchParams = new URLSearchParams({
			type: searchType,
			keyword: keyword.trim(),
			page: 1,
			size: 30,
		});

		navigate(`/goods/search?${searchParams.toString()}`);
	};

	// 모달 닫는 함수
	const closeModal = () => setIsModalOpen(false);

	return (
		<>
			<form onSubmit={handleSearch} className="goods-search-bar">
				<div className="search-container">
					<select
						value={searchType}
						onChange={(e) => setSearchType(e.target.value)}
						className="search-type">
						<option value="gs">상품명 | 상점명</option>
						<option value="g">상품명</option>
						<option value="s">상점명</option>
					</select>

					<div className="input-wrapper">
						<input
							type="text"
							value={keyword}
							ref={inputRef}
							onChange={(e) => setKeyword(e.target.value)}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							placeholder="검색어를 입력하세요"
							className="search-input"
						/>
						<div className={`focus-line ${isFocused ? "focused" : ""}`} />
					</div>

					<div className="button-group">
						{/* 모달 열기 버튼 */}
						<button
							type="button"
							className="icon-button"
							onClick={() => {
								// 모달이 열려있지 않을 경우에만 열도록
								if (!isModalOpen) setIsModalOpen(true);
							}}>
							<Image className="w-5 h-5" />
						</button>
						<button type="submit" className="icon-button">
							<Search className="w-5 h-5" />
						</button>
					</div>
				</div>
			</form>

			{/* 모달 */}
			{isModalOpen && (
				<div className="image-modal-overlay" onClick={closeModal}>
					<div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
						{/* 모달 내용 */}
						<ImageClassifier onClose={closeModal} />
					</div>
				</div>
			)}
		</>
	);
};

export default GoodsSearchBar;
