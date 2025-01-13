// components/common/CustomModal.js
import React from "react";
import Modal from "react-modal";
import "../../styles/CustomModal.scss";

const CustomModal = ({
	isOpen,
	onClose,
	title,
	children,
	buttons,
	className = "",
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onClose}
			contentLabel={title}
			className={`custom-modal ${className}`}
			overlayClassName="custom-modal-overlay">
			<div className="modal-content">
				<div className="modal-header">
					<h2>{title}</h2>
				</div>
				<div className="modal-body">{children}</div>
				{buttons && <div className="modal-footer">{buttons}</div>}
			</div>
		</Modal>
	);
};

export default CustomModal;
