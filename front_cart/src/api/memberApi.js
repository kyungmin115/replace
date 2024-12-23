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
