// pages/goods/GoodsListPage.js
import React from "react";
import GoodsListComponent from "../../components/goods/GoodsListComponent"; // 리스트 컴포넌트
import BasicLayout from "../../layout/BasicLayout";

const GoodsListPage = () => {
	return (
		<>
			<BasicLayout />
			<div className="goods-list-page">
				<GoodsListComponent />
			</div>
		</>
	);
};

export default GoodsListPage;
