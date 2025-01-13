import axios from "axios";
import { API_SERVER_HOST } from "./axiosApi";

const rest_api_key = ``; // rest키값
const redirect_uri = `http://localhost:3000/member/kakao`;

const auth_code_path = `https://kauth.kakao.com/oauth/authorize`;

const access_token_url = `https://kauth.kakao.com/oauth/token`;

export const getKakaoLoginLink = () => {
	const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

	return kakaoURL;
};

export const getAccessToken = async (authCode) => {
	try {
		const header = {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		};
		const params = {
			grant_type: "authorization_code",
			client_id: rest_api_key,
			redirect_uri: redirect_uri,
			code: authCode,
		};

		const res = await axios.post(access_token_url, params, header);

		const accessToken = res.data.access_token;

		return accessToken;
	} catch (error) {
		console.error("Error fetching Kakao Access Token:", error);
		throw new Error("카카오 로그인 중 문제가 발생했습니다.");
	}
};

export const getMemberWithAccessToken = async (accessToken) => {
	const res = await axios.get(
		`${API_SERVER_HOST}/api/member/kakao?accessToken=${accessToken}`,
	);

	return res.data;
};
