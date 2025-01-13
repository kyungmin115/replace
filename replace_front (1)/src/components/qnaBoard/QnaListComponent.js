import React, { useCallback, useEffect, useState } from "react";
import "../../styles/qna/QnaListComponent.scss";
import PageComponent from "../common/PageComponent";
import useCustomMove from "../../hooks/useCustomMove";
import useCustomLogin from "../../hooks/useCustomLogin";
import { getList } from "../../api/qnaBoardApi";
import { useNavigate } from "react-router-dom";

const initState = {
	dtoList: [],
	pageNumList: [],
	pageRequestDTO: null,
	prev: false,
	next: false,
	totalCount: 0,
	prevPage: 0,
	nextPage: 0,
	totalPage: 0,
	current: 0,
};

const QnaListComponent = ({}) => {
	const { page, size, moveToList, moveToRead } = useCustomMove();
	const [serverData, setServerData] = useState(initState);

	const { loginState, isLogin, moveToLogin } = useCustomLogin();

	// 에러 핸들링 함수 (로그인 훅에서 가져왔던 코드 대체)
	const handleError = (err) => {
		console.error("Error occurred:", err);
		alert("데이터를 불러오는 중 오류가 발생했습니다.");
	};

	useEffect(() => {
		getList({ page, size })
			.then((data) => {
				console.log("Fetched Data:", data);
				setServerData(data);
			})
			.catch((err) => handleError(err));
	}, [page, size]);

	const navigate = useNavigate();

	const handleClickAdd = useCallback(() => {
		if (!isLogin) {
			alert("로그인이 필요합니다.");
			moveToLogin();
			return;
		}
		navigate("/board/add");
	}, [isLogin, moveToLogin, navigate]);

	return (
		<div className="qna-community">
			<div className="qna-header">
				<h1>문의 목록</h1>
				<p>궁금한 점을 공유하고 답변을 받아보세요.</p>
			</div>
			<button className="list-active" onClick={handleClickAdd}>
				문의하기
			</button>
			<div className="qna-list">
				{serverData.dtoList.map((qna) => (
					<div
						key={qna.qno}
						className={`qna-item ${qna.secret ? "secret" : ""}`}
						onClick={() => {
							// 비밀글 확인: 작성자 본인 또는 ADMIN만 볼 수 있도록 설정
							if (
								qna.secret &&
								(!isLogin ||
									(qna.writer !== loginState.id && !loginState.roles.includes("ADMIN")))
							) {
								alert("비밀글은 작성자 또는 관리자만 확인할 수 있습니다.");
								return;
							}
							moveToRead(qna.qno);
						}}>
						<div className="qna-info">
							<span className="qna-id"># {qna.qno}</span>
							<span className="qna-title">
								{qna.secret &&
								(!isLogin ||
									(qna.writer !== loginState.id && !loginState.roles.includes("ADMIN")))
									? "비밀글입니다."
									: qna.title}
							</span>
						</div>
						<div className="qna-meta">
							<span className="qna-date">{qna.create}</span>
							{qna.secret && <span className="qna-secret-tag">비밀글</span>}
							<span
								className={`qna-reply-status ${
									qna.qnaReplyStatus === "COMPLETED" ? "completed" : "waiting"
								}`}>
								{qna.qnaReplyStatus === "COMPLETED" ? "답변 완료" : "답변 대기 중"}
							</span>
						</div>
					</div>
				))}
			</div>
			<PageComponent serverData={serverData} movePage={moveToList} />
		</div>
	);
};

export default QnaListComponent;
