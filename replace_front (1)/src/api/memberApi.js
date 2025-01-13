import axios from "axios";
import jwtAxios from "../util/jwtUtil";

const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/api/member`;

export const loginPost = async (loginParam) => {
	const header = { headers: { "Content-Type": "x-www-form-urlencoded" } };

	const form = new FormData();
	form.append("username", loginParam.id);
	form.append("password", loginParam.pw);

	const res = await axios.post(`${host}/login`, form, header);

	return res.data;
};

export const modifyMember = async (member) => {
	const res = await jwtAxios.put(`${host}/modify`, member);

	return res.data;
};

// 회원 탈퇴 요청//0109추가
export const deleteMember = async () => {
	console.log("Request URL:", `${host}/delete`);
	const res = await jwtAxios.delete(`${host}/delete`);
	return res.data;
};

// 로그인한 사용자의 정보를 가져오는 요청 0103
export const getMemberInfo = async () => {
	console.log("Request URL:", `${host}/me`);
	const res = await jwtAxios.get(`${host}/me`);
	return res.data;
};
