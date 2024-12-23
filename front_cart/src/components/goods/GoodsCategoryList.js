import React, { useEffect, useState } from "react";
import { getGoodsCategories } from "../utils/goodsCategoryApi"; // 굿즈 카테고리 조회 함수 import

const GoodsCategoryList = () => {
	const [categories, setCategories] = useState([]); // 굿즈 카테고리 목록 상태
	const [loading, setLoading] = useState(true); // 로딩 상태

	// 굿즈 카테고리 목록 가져오기
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const data = await getGoodsCategories(); // 카테고리 목록 가져오기
				setCategories(data); // 받은 데이터를 상태에 저장
			} catch (error) {
				console.error("굿즈 카테고리를 가져오는 데 실패했습니다.");
			} finally {
				setLoading(false); // 로딩 완료
			}
		};

		fetchCategories();
	}, []); // 컴포넌트가 마운트될 때 한 번만 호출

	// 로딩 중에는 로딩 메시지 출력
	if (loading) {
		return <div>로딩 중...</div>;
	}

	// 카테고리 목록을 받아왔으면 출력
	return (
		<div>
			<h2>굿즈 카테고리</h2>
			{categories.length === 0 ? (
				<p>등록된 카테고리가 없습니다.</p>
			) : (
				<ul>
					{categories.map((category) => (
						<li key={category.goodsCategoryId}>{category.goodsCategoryName}</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default GoodsCategoryList;
