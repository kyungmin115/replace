import React, { useState, useEffect } from "react";
import "../../styles/reply/ReplyComponent.scss";
import { registerReply, getReplies } from "../../api/replyApi";

const ReplyComponent = ({ qnaId }) => {
	const [replies, setReplies] = useState([]); // 댓글 리스트
	const [replyText, setReplyText] = useState(""); // 입력 상태

	useEffect(() => {
		getReplies(qnaId).then((data) => {
			if (Array.isArray(data)) {
				setReplies(data); // 서버에서 가져온 댓글 리스트 설정
			} else {
				console.error("Unexpected data format:", data);
			}
		});
	}, [qnaId]);

	const handleReplyChange = (e) => {
		setReplyText(e.target.value); // 입력 상태 업데이트
	};

	const handleReplySubmit = () => {
		const replyDTO = {
			qnaId,
			replyText, // 입력된 댓글 내용
		};

		registerReply(replyDTO)
			.then((result) => {
				console.log("Reply Registered:", result);
				// 새로운 댓글 추가
				setReplies([...replies, { qrno: result.qrno, replyText }]);
				setReplyText(""); // 입력창 초기화
			})
			.catch((e) => {
				console.error("Error registering reply:", e);
			});
	};

	return (
		<div className="reply-component">
			<h3>Replies</h3>
			<ul className="reply-list">
				{replies.map((reply) => (
					<li key={reply.qrno} className="reply-item">
						<div>{reply.replyText}</div>
					</li>
				))}
			</ul>
			<div className="reply-form">
				<textarea
					className="reply-input"
					placeholder="Write a reply..."
					value={replyText}
					onChange={handleReplyChange}></textarea>
				<button className="reply-btn" onClick={handleReplySubmit}>
					Add Reply
				</button>
			</div>
		</div>
	);
};

export default ReplyComponent;
