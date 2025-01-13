import "../../styles/qna/QnaAddPage.scss";

import BasicLayout from "../../layout/BasicLayout";
import QnaAddComponent from "../../components/qnaBoard/QnaAddComponent";

const QnaBoardAddPage = () => {
	return (
		<div>
			<BasicLayout />
			<div className="add-page">
				<QnaAddComponent />
			</div>
		</div>
	);
};

export default QnaBoardAddPage;
