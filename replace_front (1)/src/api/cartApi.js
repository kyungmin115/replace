import jwtAxios from "../util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080";
const CART_API_URL = `${API_SERVER_HOST}/api/cart`;

// 오류 처리 헬퍼 함수
const handleApiError = (error, action) => {
	const message =
		error.response?.data || error.message || "알 수 없는 오류가 발생했습니다.";
	console.error(`${action} 중 오류:`, message);
	throw new Error(message);
};

// 장바구니에 아이템 추가
export const addItemToCart = async (cartItemDTO) => {
	try {
		const response = await jwtAxios.post(`${CART_API_URL}/add`, cartItemDTO);
		return response.data;
	} catch (error) {
		handleApiError(error, "장바구니 아이템 추가");
	}
};

// 장바구니 조회
export const getCartItems = async () => {
	try {
		const response = await jwtAxios.get(`${CART_API_URL}/view`);
		return response.data;
	} catch (error) {
		handleApiError(error, "장바구니 조회");
	}
};

// 장바구니 아이템 수량 변경
export const updateCartItemQuantity = async ({ cartItemId, quantity }) => {
	try {
		const cartItemDTO = {
			cartItemId: cartItemId,
			quantity: quantity,
		};

		const response = await jwtAxios.post(`${CART_API_URL}/change`, cartItemDTO);
		return response.data;
	} catch (error) {
		handleApiError(error, "장바구니 아이템 수량 변경");
	}
};

// 장바구니 아이템 선택 상태 업데이트
export const updateCartItemSelection = async (cartItemId, selected) => {
	try {
		const response = await jwtAxios.put(
			`${CART_API_URL}/updateSelection/${cartItemId}`,
			{},
			{
				params: { selected },
			},
		);
		return response.data;
	} catch (error) {
		handleApiError(error, "장바구니 아이템 선택 상태 업데이트");
	}
};

// 장바구니 전체 아이템 선택/해제
export const selectAllCartItems = async (selectAll) => {
	try {
		const response = await jwtAxios.put(
			`${CART_API_URL}/selectAll`,
			{},
			{
				params: { selectAll },
			},
		);
		return response.data;
	} catch (error) {
		handleApiError(error, "장바구니 전체 선택/해제");
	}
};

// 장바구니 아이템 삭제
export const removeItemFromCart = async (cartItemId) => {
	try {
		const response = await jwtAxios.delete(
			`${CART_API_URL}/remove/${cartItemId}`,
		);
		return response.data;
	} catch (error) {
		handleApiError(error, "장바구니 아이템 삭제");
	}
};

// 선택된 아이템들 삭제
export const removeSelectedItems = async () => {
	try {
		const response = await jwtAxios.delete(`${CART_API_URL}/removeSelected`);
		return response.data;
	} catch (error) {
		handleApiError(error, "선택된 장바구니 아이템 삭제");
	}
};

// 장바구니 총 수량 조회
export const getTotalItemQuantity = async () => {
	try {
		const response = await jwtAxios.get(`${CART_API_URL}/totalQuantity`);
		return response.data; // 총 수량 반환
	} catch (error) {
		handleApiError(error, "장바구니 총 수량 조회");
	}
};
