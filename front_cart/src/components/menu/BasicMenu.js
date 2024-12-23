// import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React from "react";

const BasicMenu = () => {
	// const loginState = useSelector((state) => state.loginSlice);
	return (
		<header className="header">
			<link
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
				rel="stylesheet"
			/>
			<div className="logo">
				<img src={`${process.env.PUBLIC_URL}/images/logo_up.png`} alt="Logo" />
			</div>
			<nav className="nav">
				<ul>
					<li>
						<a href={"/performances"}>공연</a>
					</li>
					<li>
						<a href={"/goods/list"}>굿즈 샵</a>
					</li>
					<li>
						<a href={"#"}>고객센터</a>
					</li>
				</ul>
			</nav>
			<div className="search-container">
				<input type="text" placeholder="RE:PLACE에서 찾아보는 나만의 취향!" />
				<button className="search-btn">
					<i className="fas fa-search"></i> {/* FontAwesome 사용 */}
				</button>
			</div>
			<div className="icons">
				<i className="fas fa-heart"></i> {/* 찜 아이콘 */}
				<Link to="/cart">
					<i className="fas fa-shopping-cart"></i> {/* 장바구니 아이콘 */}
				</Link>
				<Link to="/member/login">
					<i className="fas fa-user"></i> {/* 사용자 아이콘 */}
				</Link>
			</div>
		</header>
	);
};

export default BasicMenu;
