import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";
import { useDispatch } from "react-redux";
import { login } from "../../slices/loginSlice";
import useCustomLogin from "../../hooks/useCustomLogin";

const KakaoRedirectPage = () => {
	const [searchParams] = useSearchParams();
	const { moveToPath } = useCustomLogin();
	const dispatch = useDispatch();

	const [isTokenFetched, setIsTokenFetched] = useState(false); // 상태 관리

	// 인가코드 받기
	const authCode = searchParams.get("code");

	useEffect(() => {
		if (!authCode || isTokenFetched) {
			return; // 이미 처리된 경우
		}

		const fetchAccessTokenAndUserInfo = async () => {
			try {
				setIsTokenFetched(true); // 요청 시작 시 상태 업데이트
				const accessToken = await getAccessToken(authCode); // 액세스 토큰 요청
				console.log(accessToken);

				const memberInfo = await getMemberWithAccessToken(accessToken); // 사용자 정보 요청
				console.log(memberInfo);

				// Redux 상태 업데이트
				dispatch(login(memberInfo));

				// 소셜 로그인 여부에 따라 페이지 이동
				if (memberInfo && !memberInfo.social) {
					moveToPath("/");
				} else {
					moveToPath("/member/modify");
				}
			} catch (error) {
				console.error("Error during Kakao login flow:", error);
				moveToPath("/error"); // 에러 페이지 이동
			}
		};

		fetchAccessTokenAndUserInfo();
	}, [authCode, isTokenFetched, dispatch, moveToPath]);

	return (
		<div>
			<div>Kakao Login Redirect</div>
			<div>{authCode}</div>
		</div>
	);
};

export default KakaoRedirectPage;
