import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGoodsById } from "../../api/goodsApi";
import "../../styles/goods/GoodsDetail.scss";
import GoodsReadComponent from "../../components/goods/GoodsReadComponent";

const GoodsReadPage = () => {
	const [goods, setGoods] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { goodsId } = useParams();
	const navigate = useNavigate();

	// 상품 데이터 불러오기
	useEffect(() => {
		const fetchGoods = async () => {
			try {
				const data = await getGoodsById(Number(goodsId));
				setGoods(data);
				setLoading(false);
			} catch (err) {
				setError(err);
				setLoading(false);
			}
		};

		fetchGoods();
	}, [goodsId]);

	if (loading) return <div className="loading">상품 정보 로딩 중...</div>;
	if (error)
		return <div className="error">상품 정보를 불러오는 중 오류 발생</div>;
	if (!goods) return <div className="error">상품 정보가 없습니다.</div>;

	return (
		<div className="goods-detail-page">
			{/* 상품 상세 정보를 보여주는 컴포넌트 */}
			<GoodsReadComponent goods={goods} />
		</div>
	);
};

export default GoodsReadPage;
