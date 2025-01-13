import { API_SERVER_HOST } from "./axiosApi";
import jwtAxios from "../util/jwtUtil";

const adminMemberPrefix = `${API_SERVER_HOST}/api/admin/members`;

export const getAdminMembers = async () => {
	const res = await jwtAxios.get(adminMemberPrefix);
	return res.data;
};

// 회원 삭제
export const deleteAdminMember = async (id) => {
	const res = await jwtAxios.delete(`${adminMemberPrefix}/${id}`);
	return res.data;
};

// 회원 검색
export const searchAdminMembers = async (keyword) => {
	const res = await jwtAxios.get(`${adminMemberPrefix}/search`, {
		params: { keyword },
	});
	return res.data;
};

// 이메일 발송 1230

export const sendEmail = async (memberEmails, subject, body) => {
	const res = await jwtAxios.post(
		`${adminMemberPrefix}/send-email`,
		{ memberEmails: memberEmails, subject: subject, body: body }, // 요청 본문
	);
	return res.data;
};

// export const sendEmail = async (memberEmails, subject, body) => {
//   const res = await axios.post(
//     `${adminMemberPrefix}/send-email`,
//     { memberEmails, subject, body }, // 요청 본문
//     { withCredentials: true } // 쿠키 포함
//   );
//   return res.data;
// };

// import axios from "axios";

// const adminMemberPrefix = "/api/admin/members";

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("accessToken");
//   if (!token) {
//     console.error("Access token is missing");
//     return {};
//   }
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

// export const getAdminMembers = async () => {
//   const res = await axios.get(adminMemberPrefix);
//   return res.data;
// };

// export const deleteAdminMember = async (id) => {
//   const res = await axios.delete(`${adminMemberPrefix}/${id}`);
//   return res.data;
// };

// export const searchAdminMembers = async (keyword) => {
//   const res = await axios.get(`${adminMemberPrefix}/search`, {
//     params: { keyword },
//   });
//   return res.data;
// };
