import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import loginSlice from "./slices/loginSlice";

const store = configureStore({
	reducer: {
		loginSlice: loginSlice,
		cart: cartSlice,
	},
});

export default store;
