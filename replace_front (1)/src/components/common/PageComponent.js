import "../../styles/PageComponent.scss";

const PageComponent = ({ serverData, movePage }) => {
	return (
		<div className="page-container">
			{/* 맨 앞 페이지로 이동 */}
			{serverData.current > 10 && (
				<div className="prev-next" onClick={() => movePage({ page: 1 })}>
					&lt;&lt;
				</div>
			)}

			{/* 이전 페이지로 이동 */}
			{serverData.prev && (
				<div
					className="prev-next"
					onClick={() => movePage({ page: serverData.prevPage })}>
					&lt;
				</div>
			)}

			{/* 현재 페이지 목록 */}
			{serverData.pageNumList.map((pageNum) => (
				<div
					key={pageNum}
					className={`page-item ${serverData.current === pageNum ? "active" : ""}`}
					onClick={() => movePage({ page: pageNum })}>
					{pageNum}
				</div>
			))}

			{/* 다음 페이지로 이동 */}
			{serverData.next && (
				<div
					className="prev-next"
					onClick={() => movePage({ page: serverData.nextPage })}>
					&gt;
				</div>
			)}

			{/* 맨 끝 페이지로 이동 */}
			{serverData.current < serverData.totalPage && (
				<div
					className="prev-next"
					onClick={() => movePage({ page: serverData.totalPage })}>
					&gt;&gt;
				</div>
			)}
		</div>
	);
};

export default PageComponent;
