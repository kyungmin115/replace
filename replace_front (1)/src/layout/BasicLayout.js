import React from "react";
import "./BasicLayout.scss";
import BasicMenu from "../components/menu/BasicMenu";

const BasicLayout = ({ children }) => {
	return (
		<>
			<BasicMenu />

			<div className="layout-container">
				<main>{children}</main>
				{/*<aside className="bg-gray-300 md:w-1/3 lg:w-1/4 px-5 flex py-5">*/}
				{/*</aside>*/}
			</div>
		</>
	);
};

export default BasicLayout;
