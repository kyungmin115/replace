import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteMember } from "../../api/memberApi"; // 회원 탈퇴 API 호출
import "../../styles/my/MyDeleteComponent.scss";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/loginSlice";

//회원 탈퇴
const MyDeleteComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteAccount = async () => {
    if (window.confirm("정말로 회원 탈퇴를 진행하시겠습니까?")) {
      try {
        await deleteMember(); // API 호출
        alert("회원 탈퇴가 완료되었습니다.");
        navigate("/"); // 탈퇴 후 홈으로 리다이렉트

        // Redux 상태 초기화
        dispatch(logout());
      } catch (error) {
        console.error("회원 탈퇴 실패:", error);
        alert("회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="my-delete-component">
      <h2>회원 탈퇴</h2>
      <p>정말로 탈퇴하시겠습니까?</p>
      <button className="delete-button" onClick={handleDeleteAccount}>
        회원 탈퇴
      </button>
    </div>
  );
};

export default MyDeleteComponent;
