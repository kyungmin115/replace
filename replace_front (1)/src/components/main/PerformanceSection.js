import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Heart } from "lucide-react";
import "./PerformanceSection.scss";
import useCustomLogin from "../../hooks/useCustomLogin";
import {
	addToWishList,
	isInWishList,
	removeFromWishList,
} from "../../api/wishListApi";
import CustomModal from "../common/CustomModal";

const BASE_URL = "http://localhost:8080";

const PerformanceSection = () => {
	const [performances, setPerformances] = useState([]);
	const { isLogin, moveToLogin } = useCustomLogin();
	const [wishlistMap, setWishlistMap] = useState({});
	const [modalState, setModalState] = useState({ login: false });

	useEffect(() => {
		const fetchPerformances = async () => {
			try {
				const response = await axios.get(
					`${BASE_URL}/api/performances?page=0&size=8`,
				);
				setPerformances(response.data.content);
			} catch (error) {
				console.error("공연 정보를 가져오는 중 오류가 발생했습니다.", error);
			}
		};

		fetchPerformances();
	}, []);

	useEffect(() => {
		const checkWishlistStatus = async () => {
			if (!isLogin) return;
			const newWishlistMap = {};
			for (const performance of performances) {
				const isWishlisted = await isInWishList(performance.pid);
				newWishlistMap[performance.pid] = isWishlisted;
			}
			setWishlistMap(newWishlistMap);
		};

		if (performances.length > 0) {
			checkWishlistStatus();
		}
	}, [performances, isLogin]);

	const openModal = (type) => {
		setModalState((prevState) => ({ ...prevState, [type]: true }));
	};

	const closeModal = (type) => {
		setModalState((prevState) => ({ ...prevState, [type]: false }));
	};

	const handleLoginConfirm = () => {
		closeModal("login");
		moveToLogin(); // 로그인 페이지로 이동
	};

	const handleWishClick = async (performanceId) => {
		if (!isLogin) {
			openModal("login");
			return;
		}
		try {
			const isCurrentlyWishlisted = wishlistMap[performanceId];
			if (isCurrentlyWishlisted) {
				await removeFromWishList(performanceId);
			} else {
				await addToWishList(performanceId);
			}
			setWishlistMap((prev) => ({
				...prev,
				[performanceId]: !prev[performanceId],
			}));
		} catch (error) {
			console.error("찜하기 처리 중 오류 발생:", error);
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
		<div className="performance-section-container">
			<div className="performance-section-header">
				<h2 className="performance-section-h2">RE:PLACE PICK! 추천공연</h2>
				<Link to="/performances" className="go-to-performance-list-button">
					See More
				</Link>
			</div>

			<div className="performance-section-grid">
				{performances.length > 0 ? (
					performances.map((performance) => (
						<div key={performance.pid} className="performance-section-card">
							<div className="performance-section-image-container">
								<Link to={`/performances/${performance.pid}`}>
									<img
										src={performance.posterUrl}
										alt={performance.pname}
										className="performance-section-image"
									/>
								</Link>
								<button
									className="performance-section-wish-button"
									onClick={() => handleWishClick(performance.pid)}>
									<Heart
										className={`heart-icon ${
											wishlistMap[performance.pid] ? "active" : ""
										}`}
										style={{
											fill: wishlistMap[performance.pid] ? "#ff0000" : "none",
											stroke: wishlistMap[performance.pid] ? "#ff0000" : "currentColor",
										}}
									/>
								</button>
							</div>
							<div className="performance-section-info">
								<h3>
									<Link
										to={`/performances/${performance.pid}`}
										className="performance-section-title-link">
										{performance.pname}
									</Link>
								</h3>
								<p className="performance-section-genre">{performance.genre}</p>
								<p className="performance-section-date">
									{formatDate(performance.startDate)} - {formatDate(performance.endDate)}
								</p>
								<p className="performance-section-venue">{performance.fname}</p>
							</div>
						</div>
					))
				) : (
					<p>추천 공연이 없습니다.</p>
				)}
			</div>

			{/* 로그인 모달 */}
			<CustomModal
				isOpen={modalState.login}
				onClose={() => closeModal("login")}
				title="로그인 확인"
				buttons={
					<>
						<button onClick={() => closeModal("login")} className="cancel-btn">
							닫기
						</button>
						<button onClick={handleLoginConfirm} className="confirm-btn">
							로그인
						</button>
					</>
				}>
				<p>로그인이 필요합니다.</p>
				<p>RE:PLACE에 로그인하고 내 취향을 찾아보세요!</p>
			</CustomModal>
		</div>
	);
};

export default PerformanceSection;
