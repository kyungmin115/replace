import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useCustomLogin from "../../hooks/useCustomLogin";
import useAdminOnly from "../../hooks/useAdminOnly";
import { getTotalItemQuantityAsync } from "../../slices/cartSlice";
import "./BasicMenu.scss";

const BasicMenu = () => {
	const { isLogin, moveToLogin, doLogout, moveToPath } = useCustomLogin();
	const { isAdmin } = useAdminOnly();
	const dispatch = useDispatch();
	const cartItemCount = useSelector((state) => state.cart.totalQuantity);
	const location = useLocation(); // 현재 경로 확인
	const isMainPage = location.pathname === "/"; // 메인 페이지 여부 확인

	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);
	const SCROLL_THRESHOLD = 250;

	const [isScrolled, setIsScrolled] = useState(false);
	const [isHovered, setIsHovered] = useState(false); // 호버 상태 관리

	useEffect(() => {
		if (isLogin) {
			dispatch(getTotalItemQuantityAsync());
		}
	}, [dispatch, isLogin]);

	useEffect(() => {
		// 스크롤 상태 업데이트 함수
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (window.scrollY > 0) {
				setIsScrolled(true); // 스크롤이 내려갔을 때
			} else {
				setIsScrolled(false); // 맨 위일 때
			}

			if (currentScrollY > SCROLL_THRESHOLD && currentScrollY > lastScrollY) {
				setIsHeaderVisible(false);
			} else {
				setIsHeaderVisible(true);
			}

			setLastScrollY(currentScrollY);
		};

		// 스크롤 이벤트 리스너 등록
		window.addEventListener("scroll", handleScroll);

		return () => {
			// 컴포넌트가 언마운트될 때 리스너 제거
			window.removeEventListener("scroll", handleScroll);
		};
	}, [lastScrollY]);

	const handleLogout = () => {
		doLogout();
		alert("로그아웃되었습니다.");
		moveToPath("/");
	};

	// 로고 이미지 선택
	const logoSrc =
		isMainPage && !isScrolled && !isHovered
			? `${process.env.PUBLIC_URL}/images/logo.png` // 메인 페이지 투명 상태 로고
			: `${process.env.PUBLIC_URL}/images/logo_up.png`; // 스크롤 시와 일반 페이지 로고

	return (
		<header
			className={`header ${isHeaderVisible ? "" : "hidden"} ${
				isMainPage ? `main-page ${isScrolled ? "scrolled" : ""}` : ""
			}`}
			onMouseEnter={() => setIsHovered(true)} // 호버 시 상태 변경
			onMouseLeave={() => setIsHovered(false)} // 호버 해제 시 상태 변경
		>
			<link
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
				rel="stylesheet"
			/>
			<div className="logo">
				<Link to="/">
					<img src={logoSrc} alt="Logo" />
				</Link>
			</div>
			<nav className="nav">
				<ul>
					<li>
						<a href={"/performances"}>공연</a>
					</li>
					<li>
						<a href={"/goods/list"}>굿즈 스토어</a>
					</li>
					<li>
						<a href={"/board"}>고객센터</a>
					</li>
				</ul>
			</nav>
			<div className="icons">
				{!isAdmin && (
					<>
						<Link
							to={isLogin ? "/wishList" : "#"}
							onClick={() => {
								if (!isLogin) moveToLogin();
							}}>
							<i className="fas fa-heart"></i>
						</Link>
						<Link
							to={isLogin ? "/cart" : "#"}
							onClick={() => {
								if (!isLogin) moveToLogin();
							}}
							className="cart-link">
							<div className="cart-icon">
								<i className="fas fa-shopping-cart"></i>
							</div>
							{isLogin && cartItemCount > 0 && (
								<div className="item-count">{cartItemCount}</div>
							)}
						</Link>
						<Link
							to={isLogin ? "/member/myPage" : "#"}
							onClick={() => {
								if (!isLogin) moveToLogin();
							}}>
							<i className="fas fa-user"></i>
						</Link>
					</>
				)}
				{isLogin && isAdmin && (
					<Link to="/admin/members">
						<i className="fas fa-user"></i>
					</Link>
				)}
				{isLogin ? (
					<button onClick={handleLogout}>
						<span>LOGOUT</span>
					</button>
				) : (
					<button onClick={moveToLogin}>
						<span>SIGN IN</span>
					</button>
				)}
			</div>
		</header>
	);
};

export default BasicMenu;
