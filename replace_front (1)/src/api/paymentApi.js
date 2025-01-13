import jwtAxios from "../util/jwtUtil";

const API_BASE_URL = "http://localhost:8080/api/payments";

// 결제 요청
export const processPayment = async ({
	impUid,
	merchantUid,
	amount,
	memberId,
}) => {
	try {
		const response = await jwtAxios.post(
			`${API_BASE_URL}/checkout`,
			{ impUid, merchantUid, amount, memberId }, // 요청 바디
		);
		console.log("결제 성공:", response.data);
		return response.data;
	} catch (error) {
		console.error("결제 요청 중 오류 발생:", error);
		throw error;
	}
};

// 결제 내역 조회
export const fetchPaymentHistory = async () => {
	try {
		const response = await jwtAxios.get(`${API_BASE_URL}/history`);
		console.log("결제 내역 조회 성공:", response.data);
		return response.data;
	} catch (error) {
		console.error(
			"결제 내역 조회 중 오류 발생:",
			error.response?.data || error.message,
		);
		throw error;
	}
};

// 결제 취소
export const cancelPayment = async (impUid) => {
	try {
		const response = await jwtAxios.post(`${API_BASE_URL}/cancel`, {
			params: { impUid }, // 쿼리 파라미터 추가
		});
		console.log("결제 취소 성공:", response.data);
		return response.data;
	} catch (error) {
		console.error(
			"결제 취소 중 오류 발생:",
			error.response?.data || error.message,
		);
		throw error;
	}
};

//결제 취소 요청
export const requestCancelPayment = async (impUid) => {
	try {
		const response = await jwtAxios.post(`${API_BASE_URL}/cancel/request`, null, {
			params: { impUid },
		});
		console.log("결제 취소 요청 성공:", response.data);
		return response.data;
	} catch (error) {
		console.error(
			"결제 취소 요청 중 오류 발생:",
			error.response?.data || error.message,
		);
		throw error;
	}
};

// 취소 요청 목록 조회
export const fetchCancelRequests = async () => {
	try {
		const response = await jwtAxios.get(`${API_BASE_URL}/admin/cancel/requests`);
		console.log("취소 요청 목록 조회 성공:", response.data);
		return response.data;
	} catch (error) {
		console.error(
			"취소 요청 목록 조회 중 오류 발생:",
			error.response?.data || error.message,
		);
		throw error;
	}
};

// 취소 요청 승인/거부 처리
export const handleApproval = async (impUid, approve) => {
	try {
		const response = await jwtAxios.post(`${API_BASE_URL}/cancel/approve`, {
			params: { impUid, approve }, // URL 쿼리 파라미터로 추가
		});
		console.log("취소 요청 처리 성공:", response.data);
		return response.data;
	} catch (error) {
		console.error(
			"취소 요청 처리 중 오류 발생:",
			error.response?.data || error.message,
		);
		throw error;
	}
};

// export const fetchPaymentHistory = async () => {
//   console.log("Token:", localStorage.getItem("token"));

//   const token = localStorage.getItem("token"); // token 가져오기
//   if (!token) {
//     console.error("인증 토큰이 없습니다. 로그인이 필요합니다.");
//     throw new Error("로그인이 필요합니다.");
//   }

//   try {
//     const response = await axios.get(`${API_BASE_URL}/history`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`, // 토큰 추가
//       },
//       withCredentials: true, // 쿠키 포함
//     });
//     console.log("결제 내역:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("결제 내역 조회 중 오류 발생:", error.response?.data || error.message);
//     throw error;
//   }
// };

// export const fetchPaymentHistory = async () => {
//   console.log("Fetching payment history...");
//   console.log(localStorage.getItem("member"));
//   const member = JSON.parse(localStorage.getItem("member"));

//   if (!member || !member.token) {
//     console.error("인증 토큰이 없습니다. 로그인이 필요합니다.");
//     console.log("Parsed Member Data:", member); // 디버깅용 로그
//     throw new Error("로그인이 필요합니다.");
//   }

//   try {
//     const response = await jwtAxios.get("/api/payments/history", {
//       headers: {
//         Authorization: `Bearer ${member.token}`,
//       },
//     });
//     console.log("결제 내역 응답 데이터:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("결제 내역 조회 중 오류 발생:", error.response?.data || error.message);
//     throw error;
//   }
// };
