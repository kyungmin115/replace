import axios from "axios";

// 서버 주소
export const API_SERVER_HOST = "http://localhost:8080";
const API_PREFIX = `${API_SERVER_HOST}/api`;

// Axios 인스턴스 생성
const axiosInstance = axios.create({
	baseURL: API_PREFIX,
	withCredentials: true, // CORS 쿠키 허용
});

// 요청 인터셉터 (토큰 추가)
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// 응답 인터셉터 (에러 처리)
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					window.location.href = "/login";
					break;
				case 403:
					alert("접근 권한이 없습니다.");
					break;
				case 404:
					alert("요청한 리소스를 찾을 수 없습니다.");
					break;
				default:
					console.error("서버 오류:", error.response);
			}
		}
		return Promise.reject(error);
	},
);

// 단일 데이터 조회
export const getOne = async (tno) => {
	try {
		const response = await axiosInstance.get(`/${tno}`);
		return response.data;
	} catch (error) {
		console.error("데이터 조회 중 오류 발생:", error);
		throw error;
	}
};

// 리스트 데이터 조회
export const getList = async (pageParam) => {
	try {
		const { page, size } = pageParam;
		const response = await axiosInstance.get("/list", {
			params: { page, size },
		});
		return response.data;
	} catch (error) {
		console.error("리스트 조회 중 오류 발생:", error);
		throw error;
	}
};

export default axiosInstance;
