import React from "react";
import AdminComponent from "../../components/admin/AdminComponent";
import BasicMenu from "../../components/menu/BasicMenu";

const AdminPage = () => {
	return (
		<div>
			<BasicMenu />

			<h1>관리자 페이지</h1>

			<AdminComponent />
		</div>
	);
};

export default AdminPage;
