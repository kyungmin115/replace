import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "./Calendar";
import "./scss/PerformanceDetail.scss";
import BasicLayout from "../../layout/BasicLayout";
import axios from "axios";

const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/api/performances`;

// 카카오맵 컴포넌트
const KakaoMap = ({ latitude, longitude, facilityName }) => {
	useEffect(() => {
		const script = document.createElement("script");
		script.async = true;
		script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=&autoload=false`;
		document.head.appendChild(script);

		script.addEventListener("load", () => {
			window.kakao.maps.load(() => {
				const container = document.getElementById("map");
				const position = new window.kakao.maps.LatLng(latitude, longitude);

				const options = {
					center: position,
					level: 3,
				};

				const map = new window.kakao.maps.Map(container, options);

				const marker = new window.kakao.maps.Marker({
					position: position,
					map: map,
				});

				const infowindow = new window.kakao.maps.InfoWindow({
					content: `<div style="padding:5px;font-size:12px;">${facilityName}</div>`,
				});

				window.kakao.maps.event.addListener(marker, "mouseover", () => {
					infowindow.open(map, marker);
				});

				window.kakao.maps.event.addListener(marker, "mouseout", () => {
					infowindow.close();
				});
			});
		});

		return () => script.remove();
	}, [latitude, longitude, facilityName]);

	return (
		<div
			id="map"
			style={{
				width: "100%",
				height: "400px",
				borderRadius: "8px",
				marginTop: "20px",
			}}
		/>
	);
};

const PerformanceDetail = () => {
	const { pid } = useParams();
	const [performance, setPerformance] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);
	const [isImageZoomed, setIsImageZoomed] = useState(false);
	const [locationInfo, setLocationInfo] = useState(null);

	useEffect(() => {
		const fetchPerformance = async () => {
			try {
				const response = await axios.get(`${host}/${pid}`);
				setPerformance(response.data);

				const locationResponse = await axios.get(`${host}/${pid}/location`);
				setLocationInfo(locationResponse.data);

				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
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
			<BasicLayout />
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
						<h2>공연 예약</h2>
						<hr />
						<Calendar performance={performance} />
					</div>
				</div>
				<hr />

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
						<div className="info-item">
							<strong>공연 시간:</strong>
							<span>{performance.ptime || "정보 없음"}</span>
						</div>
					</div>
				</div>
				<hr />

				{/* 카카오맵 섹션 추가 */}
				{locationInfo && (
					<div className="performance-location">
						<h2>공연장 위치</h2>
						<KakaoMap
							latitude={parseFloat(locationInfo.latitude)}
							longitude={parseFloat(locationInfo.longitude)}
							facilityName={performance.fname}
						/>
					</div>
				)}
				<hr />
			</div>
		</div>
	);
};

export default PerformanceDetail;
