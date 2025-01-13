// PaymentComplete.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PaymentComplete.scss"; // SCSS 스타일을 import
import BasicLayout from "../../layout/BasicLayout";

const PaymentComplete = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { paymentInfo } = location.state || {};

	return (
		<div>
			<BasicLayout />

			<div className="payment-complete">
				<div className="container">
					<div className="card">
						{/* 성공 아이콘 */}
						<div className="text-center">
							<div className="icon-container">
								<svg
									width="120" // 너비를 16px로 설정
									height="120" // 높이를 16px로 설정
									className="text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<h2 className="title">결제가 성공적으로 완료되었습니다</h2>
						</div>

						{/* 결제 정보 */}
						{paymentInfo && (
							<div className="payment-info">
								<dl>
									{/* 공연 티켓 관련 정보 */}
									{paymentInfo.type === "ticket" && (
										<>
											<div className="info-item">
												<dt>공연명</dt>
												<dd>{paymentInfo.name}</dd>
											</div>
											<div className="info-item">
												<dt>공연 시간</dt>
												<dd>{paymentInfo.time}</dd>
											</div>
											<div className="info-item">
												<dt>예매 인원</dt>
												<dd>{paymentInfo.capacity}명</dd>
											</div>
										</>
									)}

									{/* 굿즈 관련 정보 */}
									{paymentInfo.type === "goods" && (
										<>
											<div className="info-item">
												<dt>상품명</dt>
												<dd>{paymentInfo.name}</dd>
											</div>
											<div className="info-item">
												<dt>수량</dt>
												<dd>{paymentInfo.quantity || "1개"}</dd>
											</div>
										</>
									)}

									{/* 공통 결제 정보 */}
									<div className="info-item">
										<dt>결제일</dt>
										<dd>{paymentInfo.orderDate}</dd>
									</div>
									<div className="info-item">
										<dt>결제 금액</dt>
										<dd>{paymentInfo.amount?.toLocaleString()}원</dd>
									</div>
									<div className="info-item">
										<dt>주문 번호</dt>
										<dd>{paymentInfo.orderId}</dd>
									</div>
									<div className="info-item">
										<dt>구매자 이름</dt>
										<dd>{paymentInfo.buyerName}</dd>
									</div>
									<div className="info-item">
										<dt>구매자 이메일</dt>
										<dd>{paymentInfo.buyerEmail}</dd>
									</div>
								</dl>
							</div>
						)}

						{/* 버튼 */}
						<div className="button-container">
							{/* <button onClick={() => navigate("/mypage")} className="primary">
								예매내역 확인하기
							</button> */}
							<button onClick={() => navigate("/")} className="secondary">
								홈으로 돌아가기
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentComplete;
