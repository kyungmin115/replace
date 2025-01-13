import React, { useState } from "react";
import { register } from "../../api/qnaBoardApi";
import "../../styles/qna/QnaAddComponent.scss";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";

const initState = {
	title: "",
	content: "",
	secret: false, // 비밀글 여부
};

const QnaAddComponent = () => {
	const [qna, setQna] = useState({ ...initState });
	const [result, setResult] = useState(null); // 결과 상태

	const { moveToList } = useCustomMove(); // useCustomMove 활용

	const handleChangeTodo = (e) => {
		const { name, value, type, checked } = e.target;
		const updatedValue = type === "checkbox" ? checked : value;

		setQna({ ...qna, [name]: updatedValue });
	};

	const handleClickAdd = () => {
		register(qna)
			.then((result) => {
				console.log(result);
				setResult(result.QNO); // 결과 데이터 변경
				moveToList(); // list 이동
				setQna({ ...initState });
			})
			.catch((e) => {
				console.error(e);
			});
	};

	const closeModal = () => {
		setResult(null);
	};

	return (
		<div className="add-container">
			{/* 모달 처리 */}
			{result ? (
				<ResultModal
					title={"Add Result"}
					content={`New Post ${result} Added`}
					callbackFn={closeModal}
				/>
			) : null}

			<h1 className="add-title">새 게시글 작성</h1>

			<div className="form-group">
				<label className="form-label">제목</label>
				<input
					className="form-input"
					name="title"
					type="text"
					placeholder="제목을 입력하세요"
					value={qna.title}
					onChange={handleChangeTodo}
				/>
			</div>

			<div className="form-group">
				<label className="form-label">내용</label>
				<textarea
					className="form-textarea"
					name="content"
					placeholder="내용을 입력하세요"
					value={qna.content}
					onChange={handleChangeTodo}></textarea>
			</div>

			<div className="form-group checkbox-group">
				<label className="form-checkbox-label">
					<input
						className="form-checkbox"
						name="secret"
						type="checkbox"
						checked={qna.secret}
						onChange={handleChangeTodo}
					/>
					비밀글로 설정
				</label>
			</div>

			<div className="button-group">
				<button type="button" className="add-button" onClick={handleClickAdd}>
					게시글 작성
				</button>
			</div>
		</div>
	);
};

export default QnaAddComponent;
