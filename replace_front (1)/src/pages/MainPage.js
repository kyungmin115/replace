import React, { useEffect, useState } from "react";
import "./MainPage.scss";
import BasicLayout from "../layout/BasicLayout";
import GoodsSection from "../components/main/GoodsSection";
import PerformanceSection from "../components/main/PerformanceSection";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const navigate = useNavigate();

	// 공연 정보 배열 (performance.pid가 공연의 고유 ID)
	const performances = [
		{ pid: "PF256048", src: "/images/main_banner_1.jpg" },
		{ pid: "PF256402", src: "/images/main_banner_2.jpg" },
		{ pid: "PF256411", src: "/images/main_banner_3.jfif" },
		{ pid: "PF256448", src: "/images/main_banner_4.jpg" },
		{ pid: "PF256010", src: "/images/main_banner_5.jpg" },
	];

	// 자동 슬라이드 효과
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % performances.length);
		}, 5000); // 5초마다 슬라이드
		return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
	}, [performances.length]);

	// 이전 슬라이드로 이동
	const goToPrevSlide = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + performances.length) % performances.length,
		);
	};

	// 다음 슬라이드로 이동
	const goToNextSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % performances.length);
	};

	// 이미지 클릭 시 해당 공연 링크로 이동
	const handleImageClick = (pid) => {
		navigate(`/performances/${pid}`);
	};

	return (
		<BasicLayout>
			{/*nav 영역*/}
			<nav className="nav-container">
				<div className="main-banner">
					<div
						className="banner-slider"
						style={{
							transform: `translateX(-${currentIndex * 100}%)`,
						}}>
						{performances.map((performance, index) => (
							<div className="banner-slide" key={index}>
								<img
									src={performance.src}
									alt={`배너 ${index + 1}`}
									onClick={() => handleImageClick(performance.pid)} // 이미지 클릭 시 공연 상세 페이지로 이동
									style={{ cursor: "pointer" }} // 클릭 가능한 느낌
								/>
							</div>
						))}
					</div>

					<div className="banner-btn-group">
						{/* 왼쪽 버튼 */}
						<button className="banner-btn left" onClick={goToPrevSlide}>
							&lt;
						</button>
						{/* 오른쪽 버튼 */}
						<button className="banner-btn right" onClick={goToNextSlide}>
							&gt;
						</button>
					</div>

					{/* 네비게이션 버튼 */}
					<div className="banner-nav">
						{performances.map((_, index) => (
							<button
								key={index}
								className={`nav-dot ${currentIndex === index ? "active" : ""}`}
								onClick={() => setCurrentIndex(index)}></button>
						))}
					</div>
				</div>

				<PerformanceSection />

				<GoodsSection />
			</nav>
			{/*footer 영역*/}
			<footer className="footer-container">
				{/* 상단 섹션 */}
				<div className="footer-content">
					{/* 왼쪽 컨택트 정보 */}
					<div className="footer-contact">
						<div>
							<h2>Contact.</h2>
						</div>
						<p>
							지역에 맞는 색을 입혀 특별한 가치를 창조하고, 지역과 청년 모두에게 새로운
							방향을 제시하는 리플레이스와 함께하세요.
						</p>
					</div>
				</div>

				{/* 하단 섹션 */}
				<div className="footer-bottom">
					<p>
						개인정보처리방침 | 사이트맵
						<br />
						주식회사 리플레이스(RE:PLACE) | 대표자: 이중모 | 사업자등록번호:
						000-00-00000
						<br />
						주소: 서울 서초구 서초대로77길 41 대동2빌딩 10층 3 강의실 | Tel.
						010-3559-2192 | Fax. 070-0000-0000 | E-mail. harun107@naver.com
					</p>
					<p>Copyright © RE:PLACE. All rights Reserved. Design by Threeway</p>
					<div className="footer-logo">RE:PLACE</div>
				</div>
			</footer>
		</BasicLayout>
	);
};

export default MainPage;

// import React, { useEffect, useState } from "react";
// import "./MainPage.scss";
// import BasicLayout from "../layout/BasicLayout";
// import GoodsSection from "../components/main/GoodsSection";
// import PerformanceSection from "../components/main/PerformanceSection";
// import { useNavigate } from "react-router-dom";

// const MainPage = () => {
// 	const [currentIndex, setCurrentIndex] = useState(0);
// 	const navigate = useNavigate();

// 	// 공연 정보 배열 (performance.pid가 공연의 고유 ID)
// 	const performances = [
// 		{ pid: "PF256048", src: "/images/main_banner_1.jpg" },
// 		{ pid: "PF256402", src: "/images/main_banner_2.jpg" },
// 		{ pid: "PF256411", src: "/images/main_banner_3.jfif" },
// 		{ pid: "PF256448", src: "/images/main_banner_4.jpg" },
// 		{ pid: "PF256010", src: "/images/main_banner_5.jpg" },
// 	];

// 	// 자동 슬라이드 효과
// 	useEffect(() => {
// 		const interval = setInterval(() => {
// 			setCurrentIndex((prevIndex) => (prevIndex + 1) % performances.length);
// 		}, 5000); // 5초마다 슬라이드
// 		return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
// 	}, [performances.length]);

// 	// 이전 슬라이드로 이동
// 	const goToPrevSlide = () => {
// 		setCurrentIndex(
// 			(prevIndex) => (prevIndex - 1 + performances.length) % performances.length,
// 		);
// 	};

// 	// 다음 슬라이드로 이동
// 	const goToNextSlide = () => {
// 		setCurrentIndex((prevIndex) => (prevIndex + 1) % performances.length);
// 	};

// 	// 이미지 클릭 시 해당 공연 링크로 이동
// 	const handleImageClick = (pid) => {
// 		navigate(`/performances/${pid}`);
// 	};

// 	return (
// 		<BasicLayout>
// 			{/*nav 영역*/}
// 			<nav className="nav-container">
// 				<div className="main-banner">
// 					<div
// 						className="banner-slider"
// 						style={{
// 							transform: `translateX(-${currentIndex * 100}%)`,
// 						}}>
// 						{performances.map((performance, index) => (
// 							<div className="banner-slide" key={index}>
// 								<img
// 									src={performance.src}
// 									alt={`배너 ${index + 1}`}
// 									onClick={() => handleImageClick(performance.pid)} // 이미지 클릭 시 공연 상세 페이지로 이동
// 									style={{ cursor: "pointer" }} // 클릭 가능한 느낌
// 								/>
// 							</div>
// 						))}
// 					</div>

// 					<div className="banner-btn-group">
// 						{/* 왼쪽 버튼 */}
// 						<button className="banner-btn left" onClick={goToPrevSlide}>
// 							&lt;
// 						</button>
// 						{/* 오른쪽 버튼 */}
// 						<button className="banner-btn right" onClick={goToNextSlide}>
// 							&gt;
// 						</button>
// 					</div>

// 					{/* 네비게이션 버튼 */}
// 					<div className="banner-nav">
// 						{performances.map((_, index) => (
// 							<button
// 								key={index}
// 								className={`nav-dot ${currentIndex === index ? "active" : ""}`}
// 								onClick={() => setCurrentIndex(index)}></button>
// 						))}
// 					</div>
// 				</div>

// 				<PerformanceSection />

// 				<GoodsSection />
// 			</nav>
// 			{/*footer 영역*/}
// 			<footer className="footer-container">
// 				{/* 상단 섹션 */}
// 				<div className="footer-content">
// 					{/* 왼쪽 컨택트 정보 */}
// 					<div className="footer-contact">
// 						<h2>Contact.</h2>
// 						<p>
// 							지역에 맞는 색을 입혀 특별한 가치를 창조하고, 지역과 청년 모두에게 새로운
// 							방향을 제시하는 리플레이스와 함께하세요.
// 						</p>
// 						<ul>
// 							<li>📍 경북 문경시 산업연 불암길 20, 2층</li>
// 							<li>📞 Tel. 054-555-1623</li>
// 							<li>📠 Fax. 070-5256-3999</li>
// 							<li>📧 E-mail. replace724@naver.com</li>
// 							<li>
// 								📷 <a href="#instagram">Instagram</a>
// 							</li>
// 						</ul>
// 					</div>

// 					{/* 오른쪽 폼 */}
// 					<div className="footer-form">
// 						<form>
// 							<input type="text" placeholder="이름 *" required />
// 							<input type="email" placeholder="이메일 *" required />
// 							<input type="text" placeholder="전화번호 *" required />
// 							<textarea placeholder="내용" rows="4" required></textarea>
// 							<div className="footer-privacy">
// 								<input type="checkbox" id="privacy" required />
// 								<label htmlFor="privacy">
// 									개인정보처리방침에 동의합니다. [내용보기]
// 								</label>
// 							</div>
// 							<button type="submit" className="send-btn">
// 								SEND
// 							</button>
// 						</form>
// 					</div>
// 				</div>

// 				{/* 하단 섹션 */}
// 				<div className="footer-bottom">
// 					<p>
// 						개인정보처리방침 | 사이트맵
// 						<br />
// 						주식회사 리플레이스(RE:PLACE) | 대표자: 도원우 | 사업자등록번호:
// 						580-86-01566
// 						<br />
// 						주소: 경북 문경시 산업연 불암길 20, 2층 | Tel. 054-555-1623 | Fax.
// 						070-5256-3999 | E-mail. replace724@naver.com
// 					</p>
// 					<p>Copyright © RE:PLACE. All rights Reserved. Design by Threeway</p>
// 					<div className="footer-logo">RE:PLACE</div>
// 				</div>
// 			</footer>
// 		</BasicLayout>
// 	);
// };

// export default MainPage;
