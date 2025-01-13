import React from "react";
import "../../pages/performance/scss/PerformanceList.scss";

const PerformancePagination = ({ currentPage, totalPages, onPageChange }) => {
	const calculatePageNumbers = () => {
		const pageGroupSize = 10;
		const startPage =
			Math.floor((currentPage - 1) / pageGroupSize) * pageGroupSize + 1;
		const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
		return Array.from(
			{ length: endPage - startPage + 1 },
			(_, index) => startPage + index,
		);
	};

	const pageNumbers = calculatePageNumbers();
	const currentPageGroup = Math.floor((currentPage - 1) / 10);
	const lastPageGroup = Math.floor((totalPages - 1) / 10);

	const handlePrevGroup = () => {
		if (currentPageGroup > 0) {
			const newPage = (currentPageGroup - 1) * 10 + 1;
			onPageChange(newPage);
		}
	};

	const handleNextGroup = () => {
		if (currentPageGroup < lastPageGroup) {
			const newPage = (currentPageGroup + 1) * 10 + 1;
			onPageChange(newPage);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	return (
		<div
			className="pagination"
			style={{ textAlign: "center", marginTop: "20px" }}>
			<button
				onClick={handlePrevGroup}
				disabled={currentPageGroup === 0}
				className="pagination-button">
				{"<<"}
			</button>
			<button
				onClick={handlePrevPage}
				disabled={currentPage === 1}
				className="pagination-button">
				{"<"}
			</button>
			{pageNumbers.map((number) => (
				<button
					key={number}
					onClick={() => onPageChange(number)}
					className={`pagination-button ${currentPage === number ? "active" : ""}`}>
					{number}
				</button>
			))}
			<button
				onClick={handleNextPage}
				disabled={currentPage >= totalPages}
				className="pagination-button">
				{">"}
			</button>
			<button
				onClick={handleNextGroup}
				disabled={currentPageGroup >= lastPageGroup}
				className="pagination-button">
				{">>"}
			</button>
		</div>
	);
};

export default PerformancePagination;
