import axios from "axios";
import jwtAxios from "../util/jwtUtil";

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
export const getGoodsList = async (
	pageParam,
	categoryId,
	goodsStatus,
	sortOrder,
) => {
	const { page, size } = pageParam;
	try {
		const params = { page, size };

		// categoryId가 있을 경우 추가
		if (categoryId) {
			params.categoryId = categoryId;
		}

		// goodsStatus가 있을 경우 추가
		if (goodsStatus) {
			params.goodsStatus = goodsStatus;
		}

		// sortOrder가 있을 경우 추가
		if (sortOrder) {
			params.sortOrder = sortOrder;
		}

		// API 호출
		const res = await axios.get(`${prefix}/list`, { params });
		return res.data; // 서버 응답 반환
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

// 검색된 상품 목록 가져오기
export const searchGoods = async (searchParams) => {
	try {
		const response = await axios.get(`${prefix}/search`, {
			params: searchParams,
		});
		return response.data;
	} catch (error) {
		console.error("상품 검색 실패:", error);
		throw error;
	}
};

// 조회수 증가
export const incrementViewCount = async (goodsId) => {
	try {
		await axios.put(`${prefix}/${goodsId}/increment-view`);
		console.log("조회수 증가 완료");
	} catch (error) {
		console.error("조회수 증가 실패:", error);
		throw error;
	}
};

// 굿즈 이름으로 조회
export const getGoodsByName = async (goodsName) => {
	try {
		// 서버에서 굿즈 이름으로 ID를 받아오는 API 호출
		const res = await axios.get(`${prefix}/findByName`, {
			params: { goodsName },
		});

		// 서버에서 받은 굿즈 ID
		const goodsId = res.data;
		console.log(goodsId);
		// 굿즈 ID를 반환
		return goodsId;
	} catch (error) {
		console.error("Error fetching goods by name:", error);
		throw error;
	}
};

// 리뷰 등록
export const registerReview = async (reviewDTO) => {
	try {
		const res = await jwtAxios.post(`${prefix}/review`, reviewDTO, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return res.data;
	} catch (error) {
		console.error("registerReview API error:", error);
		throw error;
	}
};

// 리뷰 조회
export const getReviewList = async (pageParam, goodsId) => {
	const { page, size } = pageParam;

	const res = await axios.get(`${prefix}/list/${goodsId}`, {
		params: { page, size },
	});

	return res.data;
};

// 리뷰 수정
export const modifyReview = async (rid) => {
	try {
		console.log(rid);
		const res = await jwtAxios.put(`${prefix}/review/${rid}`, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return res.data;
	} catch (error) {
		console.error("modify API error:", error);
		throw error;
	}
};

// 리뷰 삭제
export const removeReview = async (rid) => {
	const res = await jwtAxios.delete(`${prefix}/review/${rid}`);
	return res.data;
};

// 특정 리뷰 조회
export const getOneReview = async (rid) => {
	const res = await jwtAxios.get(`${prefix}/review/${rid}`);
	return res.data;
};

// 이미지 미리보기
export const reviewImage = async (fileName) => {
	if (!fileName) {
		console.error("파일 이름이 없습니다.");
		throw new Error("파일 이름이 제공되지 않았습니다.");
	}

	const url = `${prefix}/review/${fileName}`;
	console.log(`이미지 요청 URL: ${url}`);

	try {
		const res = await axios.get(url, { responseType: "blob" });
		return URL.createObjectURL(res.data); // Blob 데이터를 URL로 변환
	} catch (error) {
		console.error("이미지 요청 실패:", error);
		throw error;
	}
};
