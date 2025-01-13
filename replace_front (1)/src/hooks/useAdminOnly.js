// import { useSelector } from "react-redux";

// const useAdminOnly = () => {
//   const user = useSelector((state) => state.loginSlice.user); // Redux에서 사용자 정보 가져오기
//   const isAdmin = user?.role === "admin"; // 역할이 "admin"인지 확인
//   return { isAdmin };
// };

// export default useAdminOnly;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useAdminOnly = () => {
  const loginState = useSelector((state) => state.loginSlice); // Redux 상태에서 로그인 정보 가져오기
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (loginState && loginState.roles) {
      setIsAdmin(loginState.roles.includes("ADMIN")); // ADMIN 역할 확인
    }
  }, [loginState]);

  return { isAdmin };
};

export default useAdminOnly;
