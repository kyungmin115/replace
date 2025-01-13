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

export default axiosInstance;
