import { useParams } from "react-router-dom";
import "../../styles/qna/QnaBoardModifyPage.scss";

import BasicLayout from "../../layout/BasicLayout";
import QnaBoardModifyComponent from "../../components/qnaBoard/QnaBoardModifyComponent";

const QnaBoardModifyPage = () => {
	const { qno } = useParams();

	return (
		<div>
			<BasicLayout />
			<div className="modify-page">
				<QnaBoardModifyComponent qno={qno} />
			</div>
		</div>
	);
};

export default QnaBoardModifyPage;
