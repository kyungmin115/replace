import React, { useState } from "react";
import BasicLayout from "../../layout/BasicLayout";
import MyComponent from "../../components/member/MyComponent";
import { useSelector } from "react-redux";
import "../../styles/my/MyPage.scss";
import MyDeleteComponent from "../../components/member/MyDeleteComponent";

//0110

const MyPage = () => {
	const [activeMenu, setActiveMenu] = useState("profile"); // 활성 메뉴 상태
	const { nickname } = useSelector((state) => state.loginSlice);

	const handleMenuClick = (menu) => {
		setActiveMenu(menu); // 메뉴 상태 업데이트
	};

	return (
		<BasicLayout>
			<div className="mypage-container">
				{/* 왼쪽 바 메뉴 */}
				<aside className="mypage-sidebar">
					<ul>
						<li
							className={activeMenu === "profile" ? "active" : ""}
							onClick={() => handleMenuClick("profile")}>
							회원 정보
						</li>
						<li
							className={activeMenu === "edit" ? "active" : ""}
							onClick={() => handleMenuClick("edit")}>
							회원 수정
						</li>
						<li
							className={activeMenu === "delete" ? "active" : ""}
							onClick={() => handleMenuClick("delete")}>
							회원 탈퇴
						</li>
					</ul>
				</aside>

				{/* 오른쪽 콘텐츠 */}
				<main className="mypage-content">
					{activeMenu === "profile" && (
						<div>
							<h1>{nickname}님의 MyPage입니다</h1>
						</div>
					)}
					{activeMenu === "edit" && <MyComponent />}

					{activeMenu === "delete" && <MyDeleteComponent />}
				</main>
			</div>
		</BasicLayout>
	);
};

export default MyPage;

//0109정상코드
// const MyPage = () => {
//   const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부

//   const handleEditClick = () => {
//     setIsEditMode(true); // 수정 모드로 전환
//   };

//   const handleCancelClick = () => {
//     setIsEditMode(false); // 수정 모드 종료
//   };

//   return (
//     <BasicLayout>
//       <div>
//         <h1>My Page</h1>
//         <MyComponent
//           isEditMode={isEditMode}
//           onEditClick={handleEditClick}
//           onCancelClick={handleCancelClick}
//         />
//       </div>
//     </BasicLayout>
//   );
// };

// export default MyPage;

// import React from "react";
// import MyComponent from "../../component/member/MyComponent";

// const MyPage = () => {
//   return (
//     <div>
//       <h1>MY PAGE</h1>
//       <MyComponent />
//     </div>
//   );
// };

// export default MyPage;
