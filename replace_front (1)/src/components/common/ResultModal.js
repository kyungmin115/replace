import "./ResultModal.scss";

const ResultModal = ({ title, content, callbackFn }) => {
	return (
		<div
			className="result-modal-overlay"
			onClick={() => {
				if (callbackFn) {
					callbackFn();
				}
			}}>
			<div className="result-modal">
				<div className="result-modal-title">{title}</div>
				<div className="result-modal-content">{content}</div>
				<div className="result-modal-footer">
					<button
						className="close-button"
						onClick={() => {
							if (callbackFn) {
								callbackFn();
							}
						}}>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default ResultModal;
