// src/components/WishListItem.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import jwtAxios from "../../util/jwtUtil";
import { addToWishList, removeFromWishList } from "../../api/wishListApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import "./scss/WishListComponent.scss"; // SCSS 파일을 임포트

const BASE_URL = "http://localhost:8080";

const WishListCompoonent = ({ item, onRemove }) => {
	const [isWishlisted, setIsWishlisted] = useState(false);
	const { isLogin, moveToLogin } = useCustomLogin(); // 로그인 상태와 함수 가져오기

	useEffect(() => {
		const checkWishlistStatus = async () => {
			try {
				const response = await jwtAxios.get(
					`${BASE_URL}/api/wishlist/check/${item.performanceId}`,
				);
				setIsWishlisted(response.data); // Set wishlist status
			} catch (error) {
				console.error("찜 상태 확인 중 오류 발생:", error);
			}
		};

		checkWishlistStatus();
	}, [item.performanceId]);

	const handleWishClick = async () => {
		try {
			if (isWishlisted) {
				await removeFromWishList(item.performanceId);
				// 찜 해제 성공 시 부모 컴포넌트에 알림
				onRemove(item.performanceId);
			} else {
				await addToWishList(item.performanceId);
			}
			setIsWishlisted(!isWishlisted);
		} catch (error) {
			console.error("찜 처리 중 오류 발생:", error);
			alert("찜 처리 중 오류가 발생했습니다.");
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
			2,
			"0",
		)}월 ${String(date.getDate()).padStart(2, "0")}일`;
	};

	return (
		<div className="performance-card">
			<div className="image-container">
				<Link to={`/performances/${item.performanceId}`}>
					<img
						className="performance-image"
						src={item.posterUrl}
						alt={item.performanceName}
					/>
				</Link>
				<button
					className="wish-button"
					onClick={handleWishClick}
					aria-label={isWishlisted ? "찜 해제" : "찜 추가"}>
					<Heart
						className="heart-icon"
						fill={isWishlisted ? "#e74c3c" : "none"}
						color={isWishlisted ? "#e74c3c" : "currentColor"}
					/>
				</button>
			</div>
			<div className="performance-info">
				<Link to={`/performances/${item.performanceId}`} className="title-link">
					<h3>{item.performanceName}</h3>
				</Link>
				<p className="genre">{item.genre}</p>
				<p className="date">
					{formatDate(item.startDate)} - {formatDate(item.endDate)}
				</p>
			</div>
		</div>
	);
};

export default WishListCompoonent;
