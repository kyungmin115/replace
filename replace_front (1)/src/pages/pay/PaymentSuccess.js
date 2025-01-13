import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../util/jwtUtil";

const PaymentSuccess = () => {
	const navigate = useNavigate();
	const [isProcessing, setIsProcessing] = useState(true);

	useEffect(() => {
		const processPayment = async () => {
			try {
				const urlParams = new URLSearchParams(window.location.search);
				const pgToken = urlParams.get("pg_token");
				const orderId = localStorage.getItem("orderId");
				const paymentKey = localStorage.getItem("paymentKey");

				const response = await jwtAxios.post("/api/payments/approve", null, {
					params: {
						pgToken,
						orderId,
						paymentKey,
					},
				});

				alert("결제가 완료되었습니다!");
				navigate("/order/complete", {
					state: { paymentInfo: response.data },
				});
			} catch (error) {
				console.error("Payment approval failed:", error);
				alert("결제 승인 중 오류가 발생했습니다.");
				navigate("/");
			} finally {
				setIsProcessing(false);
			}
		};

		processPayment();
	}, [navigate]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				{isProcessing ? (
					<>
						<h2 className="text-xl font-bold mb-4">결제 처리중...</h2>
						<p>잠시만 기다려주세요.</p>
					</>
				) : (
					<h2 className="text-xl font-bold">결제가 완료되었습니다!</h2>
				)}
			</div>
		</div>
	);
};

export default PaymentSuccess;
