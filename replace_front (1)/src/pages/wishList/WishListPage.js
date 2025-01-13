// src/pages/WishListPage.js
import React, { useEffect, useState } from "react";
import { getWishList } from "../../api/wishListApi";
import WishListComponent from "../../components/wishList/WishListComponent";
import BasicLayout from "../../layout/BasicLayout";

const WishListPage = () => {
	const [wishList, setWishList] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchWishList = async () => {
			try {
				const data = await getWishList();
				setWishList(data);
			} catch (err) {
				setError(err.message);
			}
		};

		fetchWishList();
	}, []);

	const handleRemoveItem = (performanceId) => {
		setWishList((prevList) =>
			prevList.filter((item) => item.performanceId !== performanceId),
		);
	};

	return (
		<div>
			<BasicLayout />
			<div className="container">
				<h2 className="list">찜 목록</h2>
				{error && <div className="error-message">{error}</div>}
				<div className="performance-grid">
					{wishList.map((item) => (
						<WishListComponent
							key={item.performanceId}
							item={item}
							onRemove={handleRemoveItem}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default WishListPage;
