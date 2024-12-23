import { useState } from "react";
import axios from "axios";

const useCheckDuplicate = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const checkDuplicate = async (type, value) => {
    if (!value) {
      const message = "값을 입력하세요.";
      setErrorMessage(message); // 값 없으면 에러 메시지 설정
      throw new Error(message);
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/member/check`,
        {
          params: { [type]: value }, // 요청 파라미터 전달
        }
      );
      setErrorMessage(""); // 성공 시 에러 메시지 초기화
      return response.data.message || "사용 가능한 값입니다.";
    } catch (error) {
      const errorResponse =
        error.response?.data?.message || "중복 확인 중 오류가 발생했습니다.";
      setErrorMessage(errorResponse); // 실패 시 에러 메시지 설정
      throw new Error(errorResponse);
    }
  };

  return { checkDuplicate, errorMessage };
};

export default useCheckDuplicate;
