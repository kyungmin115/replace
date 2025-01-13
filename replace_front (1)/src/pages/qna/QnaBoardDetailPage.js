import { useParams } from "react-router-dom";
import "../../styles/qna/QnaBoardDetailPage.scss";

import BasicLayout from "../../layout/BasicLayout";
import QnaDetailComponent from "../../components/qnaBoard/QnaDetailComponent";

const QnaBoardDetailPage = () => {
	const { qno } = useParams();

	return (
		<div>
			<BasicLayout />
			<div className="read-page">
				<QnaDetailComponent qno={qno}></QnaDetailComponent>
			</div>
		</div>
	);
};

export default QnaBoardDetailPage;
