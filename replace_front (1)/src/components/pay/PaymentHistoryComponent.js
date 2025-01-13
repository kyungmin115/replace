import React, { useEffect, useState } from "react";
import {
	cancelPayment,
	fetchPaymentHistory,
	requestCancelPayment,
} from "../../api/paymentApi";

const PaymentHistoryPage = () => {
	const [payments, setPayments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadPayments = async () => {
			try {
				setLoading(true);
				const data = await fetchPaymentHistory();
				setPayments(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		loadPayments();
	}, []);

	const handleCancel = async (impUid) => {
		try {
			await requestCancelPayment(impUid); // 취소 요청
			alert("결제 취소 요청이 성공적으로 접수되었습니다.");
			setPayments((prev) =>
				prev.map((payment) =>
					payment.impUid === impUid
						? { ...payment, status: "REFUND_REQUESTED" }
						: payment,
				),
			);
		} catch (err) {
			alert("결제 취소 요청 중 오류가 발생했습니다.");
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<h2>결제 내역</h2>
			{payments.length === 0 ? (
				<p>결제 내역이 없습니다.</p>
			) : (
				<ul>
					{payments.map((payment) => (
						<li key={payment.impUid}>
							<p>결제 금액: {payment.amount}원</p>
							<p>결제 상태: {payment.status}</p>
							<p>결제 날짜: {new Date(payment.paymentDate).toLocaleString()}</p>
							<button onClick={() => handleCancel(payment.impUid)}>결제 취소</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default PaymentHistoryPage;
