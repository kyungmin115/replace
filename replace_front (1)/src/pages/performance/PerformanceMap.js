// PerformanceMap.jsx
import React, { useEffect } from "react";

const PerformanceMap = ({ latitude, longitude, facilityName }) => {
	useEffect(() => {
		// 카카오맵 script 로드
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

				// 마커 생성
				const marker = new window.kakao.maps.Marker({
					position: position,
					map: map,
				});

				// 인포윈도우 생성
				const infowindow = new window.kakao.maps.InfoWindow({
					content: `<div style="padding:5px;font-size:12px;">${facilityName}</div>`,
				});

				// 마커에 마우스오버 이벤트 등록
				window.kakao.maps.event.addListener(marker, "mouseover", function () {
					infowindow.open(map, marker);
				});

				// 마커에 마우스아웃 이벤트 등록
				window.kakao.maps.event.addListener(marker, "mouseout", function () {
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
				boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
			}}
		/>
	);
};
