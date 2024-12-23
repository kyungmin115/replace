import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";
import { useDispatch } from "react-redux";
import { login } from "../../slices/loginSlice";
import useCustomLogin from "../../hooks/useCustomLogin";

const KakaoRedirectPage = () => {
	const [searchParams] = useSearchParams();

	const { moveToPath } = useCustomLogin();
	const dispatch = useDispatch();

	// 인가코드 받기위한 변수
	const authCode = searchParams.get("code");

	useEffect(() => {
		// 액세스 토큰 요청
		getAccessToken(authCode).then((accessToken) => {
			console.log(accessToken);

			// 사용자 정보 요청
			getMemberWithAccessToken(accessToken).then((memberInfo) => {
				console.log("------------------");
				console.log(memberInfo);

				// Redux 상태 업데이트
				dispatch(login(memberInfo));

				// 소셜 로그인 여부에 따른 경로 이동
				if (memberInfo && !memberInfo.social) {
					moveToPath("/");
				} else {
					moveToPath("/member/modify");
				}
			});
		});
	}, [authCode]);

	return (
		<div>
			<div>Kakao Login Redirect</div>
			<div>{authCode}</div>
		</div>
	);
};

export default KakaoRedirectPage;
