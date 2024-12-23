import axios from "axios";

// 서버 주소
const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/goods`;

// 굿즈 하나 조회
export const getGoodsById = async (goodsId) => {
	try {
		const res = await axios.get(`${prefix}/${goodsId}`);
		return res.data;
	} catch (error) {
		console.error("Error fetching goods by ID:", error);
		throw error;
	}
};

// 굿즈 목록 조회
export const getGoodsList = async (pageParam) => {
	const { page, size } = pageParam;
	try {
		const res = await axios.get(`${prefix}/list`, { params: { page, size } });
		return res.data;
	} catch (error) {
		console.error("Error fetching goods list:", error);
		throw error;
	}
};

// 굿즈 카테고리 목록 조회
export const getGoodsCategories = async () => {
	try {
		const res = await axios.get(`${prefix}/categories`);
		return res.data;
	} catch (error) {
		console.error("Error fetching goods categories:", error);
		throw error;
	}
};

// 카테고리별 굿즈 목록 조회
export const getGoodsListByCategory = async (categoryId, pageParam) => {
	const { page, size } = pageParam;
	try {
		const res = await axios.get(`${prefix}/category/${categoryId}`, {
			params: { page, size },
		});
		return res.data;
	} catch (error) {
		console.error("Error fetching goods by category:", error);
		throw error;
	}
};
