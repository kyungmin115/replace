import axios from "axios";
import jwtAxios from "../util/jwtUtil";
// import axios from "axios";

const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/api/board`;

// 게시글 목록 조회
export const getList = async (pageParam) => {
	const { page, size } = pageParam;

	const res = await axios.get(`${host}/list`, {
		params: { page: page, size: size },
	});

	return res.data;
};

// export const getList = async (pageParam) => {
// 	const { page, size } = pageParam;
// 	try {
// 		const res = await axios.get(`${host}/list`, { params: { page, size } });
// 		return res.data;
// 	} catch (error) {
// 		console.error("Error: ", error);
// 		throw error;
// 	}
// };

export const getReplyList = async (pageParam, qno) => {
	const { page, size } = pageParam;

	const res = await jwtAxios.get(`${host}/list/${qno}`, {
		params: { page, size },
	});

	return res.data;
};

// 게시글 상세 조회 및 댓글 조회
export const getOne = async (qno, pageParam) => {
	const { page, size } = pageParam;

	// http://localhost:8080/api/todo/20
	const res = await axios.get(`${host}/${qno}`, {
		params: { page: page, size: size },
	});

	return res.data;
};

// 게시글 등록
export const register = async (qna) => {
	const res = await jwtAxios.post(`${host}/register`, qna);

	return res.data;
};

// 댓글 등록
export const registerReply = async (reply) => {
	const res = await jwtAxios.post(`${host}/reply`, reply);

	return res.data;
};

// 게시글 수정
export const modify = async (qna) => {
	if (!qna || !qna.qno) {
		console.error("Invalid QNA data:", qna);
		throw new Error("QNA data is invalid. 'qno' is required.");
	}

	const res = await jwtAxios.put(`${host}/${qna.qno}`, qna);

	return res.data;
};

// 게시글 삭제
export const remove = async (qno) => {
	const res = await jwtAxios.delete(`${host}/${qno}`);

	return res.data;
};

export const modifyReply = async (qrno, reply) => {
	const res = await jwtAxios.put(`${host}/reply/${qrno}`, reply);
	return res.data;
};

export const removeReply = async (qrno) => {
	const res = await jwtAxios.delete(`${host}/reply/${qrno}`);
	return res.data;
};

// 게시글 상세 조회 및 댓글 조회
export const getModify = async (qno) => {
	const res = await jwtAxios.get(`${host}/modify/${qno}`);

	return res.data;
};
