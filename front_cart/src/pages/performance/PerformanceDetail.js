import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosApi";
import Calendar from "./Calendar";
import "./scss/PerformanceDetail.scss";
import BasicLayout from "../../layout/BasicLayout";
// import CalendarTwo from "../../common/CalendarTwo";

const PerformanceDetail = () => {
	const { pid } = useParams();
	const [performance, setPerformance] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);
	const [isImageZoomed, setIsImageZoomed] = useState(false);

	useEffect(() => {
		const fetchPerformance = async () => {
			try {
				const response = await axiosInstance.get(`/performances/${pid}`, {
					withCredentials: true,
				});
				setPerformance(response.data);
				setLoading(false);
			} catch (error) {
				setError("데이터를 가져오는 데 실패했습니다.");
				setLoading(false);
			}
		};

		fetchPerformance();
	}, [pid]);

	const parseImageUrls = () => {
		const defaultImageUrl = "/path/to/default/image.jpg";

		if (performance && performance.poster_urls) {
			try {
				const posterUrls = JSON.parse(performance.poster_urls);

				if (Array.isArray(posterUrls.styurl) && posterUrls.styurl.length > 0) {
					return posterUrls.styurl;
				} else if (posterUrls.styurl) {
					return [posterUrls.styurl];
				}
			} catch (error) {
				console.error("Invalid JSON in poster_urls:", performance.poster_urls);
			}
		}

		return [defaultImageUrl];
	};

	const imageUrls = parseImageUrls();

	if (loading) return <div className="loading">로딩 중...</div>;
	if (error) return <div className="error">{error}</div>;
	if (!performance) return <div className="no-data">공연 정보가 없습니다.</div>;

	const handleImageClick = () => {
		setIsImageZoomed(!isImageZoomed);
	};

	const handleThumbnailClick = (url) => {
		setSelectedImage(url);
		setIsImageZoomed(false);
	};

	return (
		<div>
			<BasicLayout></BasicLayout>
			<div className="performance-detail">
				<div className="performance-header">
					<h2>
						{performance.pname} - {performance.fname}
					</h2>
					<hr />
				</div>

				<div className="performance-content">
					<div className="performance-gallery">
						<div className="main-image-container">
							<div className={`main-image ${isImageZoomed ? "zoomed" : ""}`}>
								<img
									src={selectedImage || imageUrls[0]}
									alt="메인 포스터"
									onClick={handleImageClick}
								/>
							</div>
						</div>

						<div className="image-thumbnails">
							{imageUrls.map((url, index) => (
								<img
									key={index}
									src={url}
									alt={`포스터 ${index + 1}`}
									className={`thumbnail ${selectedImage === url ? "active" : ""}`}
									onClick={() => handleThumbnailClick(url)}
								/>
							))}
						</div>
					</div>

					<div className="performance-calendar">
						<h2>공연 일정</h2>
						<Calendar />
					</div>
				</div>

				<div className="performance-info">
					<div className="info-grid">
						<div className="info-item">
							<strong>장르:</strong>
							<span>{performance.genre || "정보 없음"}</span>
						</div>
						<div className="info-item">
							<strong>출연:</strong>
							<span>{performance.cast || "정보 없음"}</span>
						</div>
						<div className="info-item">
							<strong>감독:</strong>
							<span>{performance.director || "정보 없음"}</span>
						</div>
						<div className="info-item">
							<strong>상영 시간:</strong>
							<span>{performance.runtime || "정보 없음"}</span>
						</div>
						<div className="info-item">
							<strong>가격:</strong>
							<span>{performance.price || "정보 없음"}</span>
						</div>
						<div className="info-item">
							<strong>공연 시작일:</strong>
							<span>{performance.startDate || "정보 없음"}</span>
						</div>
						<div className="info-item">
							<strong>공연 종료일:</strong>
							<span>{performance.endDate || "정보 없음"}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PerformanceDetail;
