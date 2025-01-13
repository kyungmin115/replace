import React, { useEffect, useState } from "react";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";
import "../../styles/qna/QnaBoardModifyComponent.scss";
import { getModify, modify, remove } from "../../api/qnaBoardApi";

const initState = {
	qno: 0,
	title: "",
	writer: "",
	content: "",
	updatedAt: "",
	secret: false,
};

const QnaBoardModifyComponent = ({ qno }) => {
	const [qna, setQna] = useState({ ...initState });
	const [result, setResult] = useState(null);
	const { moveToList, moveToRead } = useCustomMove();

	useEffect(() => {
		console.log("Received qno:", qno);
		getModify(qno).then((data) => {
			console.log("Fetched QNA data:", data);
			if (!data || !data.qno) {
				console.error("Invalid data from server:", data);
				setQna({ ...initState });
			} else {
				setQna(data);
			}
		});
	}, [qno]);

	const handleClickModify = () => {
		if (!qna || !qna.qno) {
			alert("수정할 게시글 정보가 없습니다.");
			return;
		}

		// 수정할 때 확인 메시지
		const confirmModify = window.confirm("정말 수정하시겠습니까?");
		if (!confirmModify) return; // 확인하지 않으면 작업을 진행하지 않음

		modify(qna)
			.then((data) => {
				console.log("Modify result:", data);
				setResult("Modified");
			})
			.catch((error) => {
				console.error("Error modifying QNA:", error);
				alert("수정 중 에러가 발생했습니다.");
			});
	};

	const handleClickDelete = () => {
		if (!qno) {
			alert("삭제할 게시글 ID가 없습니다.");
			return;
		}

		// 삭제할 때 확인 메시지
		const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
		if (!confirmDelete) return; // 확인하지 않으면 작업을 진행하지 않음

		remove(qno)
			.then((data) => {
				console.log("Delete result:", data);
				setResult("Deleted");
			})
			.catch((error) => {
				console.error("Error deleting QNA:", error);
				alert("삭제 중 에러가 발생했습니다.");
			});
	};

	const handleChangeTodo = (e) => {
		const { name, value, type, checked } = e.target;
		// checkbox일 경우 secret 값 변경, 그 외 input들은 기존대로 처리
		if (type === "checkbox") {
			setQna({ ...qna, [name]: checked }); // secret 값을 체크 여부에 맞게 변경
		} else {
			setQna({ ...qna, [name]: value });
		}
	};

	const closeModal = () => {
		if (result === "Deleted") {
			moveToList();
		} else if (qno) {
			moveToRead(qno);
		}
	};

	return (
		<div className="modify-container">
			{result && (
				<div className="result-modal-overlay">
					<div className="result-modal">
						<h2>처리 결과</h2>
						<p>
							{result === "Deleted"
								? "게시글이 삭제되었습니다."
								: "게시글이 수정되었습니다."}
						</p>
						<button onClick={closeModal} className="modal-close-btn">
							확인
						</button>
					</div>
				</div>
			)}

			<h1 className="modify-title">게시글 수정</h1>

			<div className="form-group">
				<label className="form-label">제목</label>
				<input
					className="form-input"
					name="title"
					type="text"
					value={qna.title}
					onChange={handleChangeTodo}
					placeholder="제목을 입력하세요"
				/>
			</div>

			<div className="form-group">
				<label className="form-label">내용</label>
				<textarea
					className="form-textarea"
					name="content"
					value={qna.content}
					onChange={handleChangeTodo}
					placeholder="내용을 입력하세요"></textarea>
			</div>

			<div className="form-group checkbox-group">
				<label className="form-label">
					<input
						type="checkbox"
						name="secret"
						checked={qna.secret}
						onChange={handleChangeTodo}
						className="form-checkbox"
					/>
					비밀글로 설정
				</label>
			</div>

			<div className="button-group">
				<button className="btn delete-btn" onClick={handleClickDelete}>
					삭제
				</button>
				<button className="btn modify-btn" onClick={handleClickModify}>
					수정
				</button>
			</div>
		</div>
	);
};

export default QnaBoardModifyComponent;
