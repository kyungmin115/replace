import "../../styles/qna/QnaBoardListPage.scss";
import React from "react";
import BasicLayout from "../../layout/BasicLayout";
import QnaListComponent from "../../components/qnaBoard/QnaListComponent";

const QnaBoardListPage = () => {
	return (
		<div>
			<BasicLayout />
			<div className="list-page">
				<main className="page-main">
					<QnaListComponent />
				</main>
			</div>
		</div>
	);
};

export default QnaBoardListPage;
