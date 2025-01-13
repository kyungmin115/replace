import React, { useEffect, useState } from "react";
import "../../styles/qna/QnaDetailComponent.scss";
import PageComponent from "../common/PageComponent";
import useCustomMove from "../../hooks/useCustomMove";
import {
	getOne,
	getReplyList,
	registerReply,
	modifyReply,
	removeReply,
} from "../../api/qnaBoardApi";
import useCustomLogin from "../../hooks/useCustomLogin";

const initState = {
	qno: 0,
	title: "",
	writer: "",
	content: "",
	createdAt: null,
	updatedAt: null,
	secrets: false,
};

const pageState = {
	dtoList: [],
	pageNumList: [],
	prev: false,
	next: false,
	totalCount: 0,
	prevPage: 0,
	nextPage: 0,
	totalPage: 0,
	current: 0,
};

const QnaDetailComponent = ({ qno }) => {
	const [qna, setQna] = useState(initState);
	const [replies, setReplies] = useState([]);
	const [replyText, setReplyText] = useState("");
	const [editReply, setEditReply] = useState({ qrno: null, text: "" }); // 수정 상태
	const [serverData, setServerData] = useState(pageState);
	const { loginState, isLogin } = useCustomLogin();
	const { page, size, refresh, moveToModify, moveToList } = useCustomMove();

	useEffect(() => {
		getOne(qno, { page, size })
			.then((data) => {
				if (data.board && data.replies) {
					setQna(data.board);
					setServerData(data.replies);
					setReplies(data.replies.dtoList || []);
					console.log(data);
				}
			})
			.catch((e) => console.error("Error getOne"));
	}, [qno, page, size, refresh]);

	// 비밀글 확인
	const isSecret = qna.secrets && loginState.id !== qna.writer;

	const handleReplyChange = (e) => setReplyText(e.target.value);

	const handleReplySubmit = () => {
		if (!replyText.trim()) return;

		// 관리자만 댓글 작성 가능
		if (!loginState.roles.includes("ADMIN")) {
			alert("관리자만 댓글을 작성할 수 있습니다.");
			return;
		}

		const replyDTO = { qno, replyText };
		registerReply(replyDTO)
			.then(() => {
				setReplyText("");
				refreshReplies();
			})
			.catch((e) => console.error("Error adding reply:", e));
	};

	const handleReplyDelete = (qrno) => {
		// 삭제 확인을 위한 창 띄우기
		const isConfirmed = window.confirm("정말로 댓글을 삭제하시겠습니까?");
		if (isConfirmed) {
			removeReply(qrno)
				.then(() => refreshReplies())
				.catch((e) => console.error("Error deleting reply:", e));
		}
	};

	const handleReplyEditChange = (e) =>
		setEditReply({ ...editReply, text: e.target.value });

	const handleReplyEdit = (qrno, replyText) =>
		setEditReply({ qrno, text: replyText });

	const handleReplyEditSubmit = () => {
		// 댓글 수정 텍스트가 비어 있으면 경고
		if (!editReply.text.trim()) {
			alert("댓글 내용을 입력해주세요.");
			return;
		}

		// 수정할 건지 확인하는 팝업
		const confirmEdit = window.confirm("수정하시겠습니까?");
		if (!confirmEdit) return; // 수정하지 않으면 아무 일도 일어나지 않음

		const replyDTO = { replyText: editReply.text };
		modifyReply(editReply.qrno, replyDTO)
			.then(() => {
				setEditReply({ qrno: null, text: "" });
				refreshReplies(); // 댓글 리스트를 갱신
			})
			.catch((e) => console.error("Error editing reply:", e));
	};

	const refreshReplies = () => {
		getReplyList({ page, size }, qno)
			.then((data) => {
				setReplies(data.dtoList || []);
				setServerData(data);
			})
			.catch((e) => console.error("Error fetching replies:", e));
	};

	return (
		<div className="qna-detail-container">
			<div className="qna-detail-header">
				<h1>제목: {qna.title}</h1>
				<div className="qna-meta">
					<span>작성자 : {qna.writer}</span>
					<span>
						작성일 : {new Date(qna.createdAt).toLocaleDateString() || "N/A"}
					</span>
					<span>
						수정일 : {new Date(qna.updatedAt).toLocaleDateString() || "N/A"}
					</span>
				</div>
			</div>
			<div className="qna-content">
				<p>{qna.content || "내용이 없습니다."}</p>
			</div>
			<div className="qna-actions">
				<button onClick={() => moveToList(serverData)}>목록으로</button>
				{/* 게시글 수정은 작성자만 가능 */}
				{isLogin && loginState.id === qna.writer && (
					<button onClick={() => moveToModify(qno)}>수정</button>
				)}
			</div>
			<hr />
			<div className="qna-replies">
				<h2>댓글</h2>
				<ul>
					{replies.map((reply) => (
						<li key={reply.qrno} className="reply-item">
							<div className="reply-content">
								<p>{reply.replyText}</p>
							</div>
							<div className="reply-actions">
								{/* 댓글 수정/삭제는 관리자만 가능 */}
								{isLogin && loginState.roles.includes("ADMIN") && (
									<>
										<button onClick={() => handleReplyEdit(reply.qrno, reply.replyText)}>
											수정
										</button>
										<button onClick={() => handleReplyDelete(reply.qrno)}>삭제</button>
									</>
								)}
							</div>
						</li>
					))}
				</ul>

				{/* 댓글 수정 */}
				{editReply.qrno && (
					<div className="edit-reply-form">
						<textarea
							className="reply-input"
							value={editReply.text}
							onChange={handleReplyEditChange}
						/>
						<button onClick={handleReplyEditSubmit}>댓글 수정</button>
					</div>
				)}

				{
					<div className="reply-form">
						<textarea
							value={replyText}
							onChange={handleReplyChange}
							placeholder="관리자만 댓글을 입력할 수 있습니다."
						/>
						<button onClick={handleReplySubmit}>댓글 작성</button>
					</div>
				}
			</div>
			<PageComponent serverData={serverData} movePage={(newPage) => {}} />
		</div>
	);
};

export default QnaDetailComponent;
