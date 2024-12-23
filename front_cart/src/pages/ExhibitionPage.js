import React from "react";
import "./ExhibitionPage.scss";

const ExhibitionPage = () => {
	return (
		<div className="shop-page">
			{/* 네비게이션 바 */}
			<nav className="navbar">
				<div className="navbar__brand">Start Bootstrap</div>
				<ul className="navbar__menu">
					<li>Home</li>
					<li>About</li>
					<li>Shop</li>
				</ul>
				<div className="navbar__cart">
					<button>
						<i className="fas fa-shopping-cart"></i> Cart <span>(0)</span>
					</button>
				</div>
			</nav>

			{/* Hero Section */}
			<header className="hero">
				<h1>Shop in style</h1>
				<p>With this shop homepage template</p>
			</header>

			{/* Product Grid */}
			<section className="products">
				<div className="product-card">
					<div className="product-card__image">450 × 300</div>
					<div className="product-card__info">
						<h3>Fancy Product</h3>
						<p>$40.00 - $80.00</p>
						<button>View options</button>
					</div>
				</div>
				<div className="product-card">
					<div className="product-card__image">450 × 300</div>
					<div className="product-card__info">
						<h3>Special Item</h3>
						<p>
							<span className="price--old">$20.00</span> <span>$18.00</span>
						</p>
						<button>Add to cart</button>
					</div>
				</div>
				<div className="product-card">
					<div className="product-card__image">450 × 300</div>
					<div className="product-card__info">
						<h3>Sale Item</h3>
						<p>
							<span className="price--old">$50.00</span> <span>$25.00</span>
						</p>
						<button>Add to cart</button>
					</div>
				</div>
				<div className="product-card">
					<div className="product-card__image">450 × 300</div>
					<div className="product-card__info">
						<h3>Popular Item</h3>
						<p>$40.00</p>
						<button>Add to cart</button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ExhibitionPage;
