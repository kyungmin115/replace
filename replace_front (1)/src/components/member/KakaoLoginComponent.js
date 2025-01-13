import { Link } from "react-router-dom";
import { getKakaoLoginLink } from "../../api/kakaoApi";
import "../../styles/login/LoginPage.scss";

const KakaoLoginComponent = () => {
  const link = getKakaoLoginLink();

  return (
    <div className="kakao-login-button">
      <a href={link}>
        <img
          src={`${process.env.PUBLIC_URL}/images/kakao_login_button.png`} // 카카오 버튼 이미지 경로
          alt="Kakao Login Button"
        />
      </a>
    </div>
  );
};

export default KakaoLoginComponent;
//   return (
//     <div className="flex flex-col">
//       <div className="text-center text-blue-500">
//         카카오 신규 로그인 시에 자동 가입처리 됩니다
//       </div>
//       <div className="flex justify-center w-full">
//         <Link to={link} className="kakao-login-button">
//           <img
//             src={`${process.env.PUBLIC_URL}/images/kakao_icon.png`}
//             alt="Kakao Icon"
//           />
//           카카오 로그인
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default KakaoLoginComponent;

{
  /*       
      <div className="flex justify-center  w-full">
        <div className="text-3xl text-center m-6 text-white font-extrabold w-3/4 bg-yellow-500 shadow-sm rounded p-2">
          <Link to={link}>KAKAO LOGIN</Link>
        </div>
      </div>
    </div>
  );
};

export default KakaoLoginComponent; */
}
