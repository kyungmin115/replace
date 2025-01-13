import jwtAxios from "../util/jwtUtil";

const API_URL = "http://localhost:8080/api/wishlist";

export const getWishList = async () => {
	try {
		const response = await jwtAxios.get(API_URL);
		return response.data;
	} catch (err) {
		throw new Error(err.message);
	}
};

export const removeFromWishList = async (pid) => {
	try {
		await jwtAxios.delete(`${API_URL}/${pid}`);
	} catch (err) {
		throw new Error(err.message);
	}
};

export const addToWishList = async (pid) => {
	try {
		await jwtAxios.post(`${API_URL}/${pid}`);
	} catch (err) {
		throw new Error(err.message);
	}
};

// 찜 목록 확인
export const isInWishList = async (pid) => {
	try {
		const response = await jwtAxios.get(`${API_URL}/check/${pid}`);
		return response.data; // true or false
	} catch (err) {
		throw new Error(err.message);
	}
};
