import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
	addItemToCart,
	getCartItems,
	updateCartItemQuantity,
	updateCartItemSelection,
	selectAllCartItems,
	removeItemFromCart,
	removeSelectedItems,
} from "../api/cartApi";

// 비동기 액션 생성
export const addItemToCartAsync = createAsyncThunk(
	"addItemToCartAsync",
	(cartItmeDTO) => {
		return addItemToCart(cartItmeDTO);
	},
);

export const getCartItemsAsync = createAsyncThunk("getCartItemsAsync", () => {
	return getCartItems();
});

export const updateCartItemQuantityAsync = createAsyncThunk(
	"updateCartItemQuantityAsync",
	({ cartItemId, quantity }) => {
		return updateCartItemQuantity({ cartItemId, quantity });
	},
);

export const updateCartItemSelectionAsync = createAsyncThunk(
	"updateCartItemSelectionAsync",
	({ cartItemId, isSelected }) => {
		return updateCartItemSelection(cartItemId, isSelected);
	},
);

export const selectAllCartItemsAsync = createAsyncThunk(
	"selectAllCartItemsAsync",
	(selectAll) => {
		return selectAllCartItems(selectAll);
	},
);

export const removeItemFromCartAsync = createAsyncThunk(
	"removeItemFromCartAsync",
	(cartItemId) => {
		return removeItemFromCart(cartItemId);
	},
);

export const removeSelectedItemsAsync = createAsyncThunk(
	"removeSelectedItemsAsync",
	() => {
		return removeSelectedItems();
	},
);

// 초기 상태
const initialState = {
	items: [],
	selectAll: true,
	loading: false,
	error: null,
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		setSelectAll: (state, action) => {
			state.selectAll = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCartItemsAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getCartItemsAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.items = action.payload; // 장바구니 아이템 업데이트
			})
			.addCase(getCartItemsAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload; // 에러 메시지 저장
			})
			.addCase(addItemToCartAsync.fulfilled, (state, action) => {
				state.items = action.payload;
			})
			.addCase(updateCartItemQuantityAsync.fulfilled, (state, action) => {
				state.items = action.payload;
			})
			.addCase(updateCartItemSelectionAsync.fulfilled, (state, action) => {
				state.items = action.payload;
			})
			.addCase(selectAllCartItemsAsync.fulfilled, (state, action) => {
				state.items = action.payload;
				state.selectAll = !state.selectAll;
			})
			.addCase(removeSelectedItemsAsync.fulfilled, (state, action) => {
				state.items = action.payload;
			})
			.addCase(removeItemFromCartAsync.fulfilled, (state, action) => {
				state.items = action.payload;
			});
	},
});

export default cartSlice.reducer;
