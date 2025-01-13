// import React, { useState } from "react";
// import { useSelector } from "react-redux"; // Redux에서 회원 정보 가져오기
// import { useLocation, useNavigate } from "react-router-dom";
// import { processPayment } from "../../api/paymentApi";

// const PaymentPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const totalPrice = location.state?.totalPrice || 0;

//   // Redux에서 로그인한 회원 정보 가져오기
//   // const { email, name } = useSelector((state) => state.auth?.user || {});
//   // const { email, name} = location.state || {};
//   const user = useSelector((state) => state.auth?.user);

//   const email = user?.email || location.state?.email || "";
//   const name = user?.name || location.state?.name || "";

// // 디버깅용 콘솔 출력
//     console.log("사용자 이메일:", email);
//     console.log("사용자 이름:", name);

//   // 사용자 입력 상태
//   const [phone, setPhone] = useState(""); // 전화번호
//   const [address, setAddress] = useState(""); // 주소
//   const [postcode, setPostcode] = useState(""); // 우편번호

//   const handlePayment = async () => {
//     if (!email || !name) {
//       alert("로그인 정보를 확인해주세요.");
//       return;
//     }

//     if (!phone || !address || !postcode) {
//       alert("모든 정보를 입력해주세요.");
//       return;
//     }

//     const merchantUid = `order_${new Date().getTime()}`; // 주문 번호 생성

//     // 포트원 결제 요청
//     const IMP = window.IMP; // 포트원 JavaScript SDK
//     IMP.init(""); // 포트원 클라이언트 키 설정

//     IMP.request_pay(
//       {
//         pg: "kakaopay", // 결제 방식: 카카오페이
//         pay_method: "card", // 카드 결제
//         merchant_uid: merchantUid, // 주문 번호
//         name: "장바구니 상품 결제", // 결제할 상품명
//         amount: totalPrice, // 총 결제 금액
//         buyer_email: email, // 로그인한 회원의 이메일
//         buyer_name: name, // 로그인한 회원의 이름
//         buyer_tel: phone, // 사용자가 입력한 전화번호
//         buyer_addr: address, // 사용자가 입력한 주소
//         buyer_postcode: postcode, // 사용자가 입력한 우편번호
//       },
//       async (response) => {
//         if (response.success) {
//           const { imp_uid: impUid, merchant_uid: merchantUid } = response;
//           console.log("결제 성공:", response);

//           try {
//             console.log({
//               impUid,
//               merchantUid,
//               amount: totalPrice,
//               memberEmail: email, // memberEmail 포함
//             });

//             const result = await processPayment({
//               impUid,
//               merchantUid,
//               amount: totalPrice,
//               memberEmail: email,
//             });
//             console.log("백엔드로 보낼 데이터:", { impUid, merchantUid, totalPrice, email });
//             alert("결제가 성공적으로 완료되었습니다.");
//             console.log("백엔드 결제 처리 결과:", result);
//             navigate("/mypage/payment/history", { state: { email, name } });//{ state: { paymentResult: result } });
//           } catch (error) {
//             console.error("백엔드 결제 처리 실패:", error);
//             alert("결제 처리 중 문제가 발생했습니다.");
//           }
//         } else {
//           console.error("결제 실패:", response.error_msg);
//           alert(`결제가 실패했습니다: ${response.error_msg}`);
//         }
//       }
//     );
//   };

//   return (
//     <div>
//       <h1>결제하기</h1>
//       <p>이메일 : {email}</p>
//       <p>이름 : {name}</p>
//       <p>결제 금액: {totalPrice.toLocaleString()}원</p>
//       <div>
//         <label>
//           전화번호:
//           <input
//             type="text"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             placeholder="전화번호를 입력하세요"
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           주소:
//           <input
//             type="text"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             placeholder="주소를 입력하세요"
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           우편번호:
//           <input
//             type="text"
//             value={postcode}
//             onChange={(e) => setPostcode(e.target.value)}
//             placeholder="우편번호를 입력하세요"
//           />
//         </label>
//       </div>
//       <button
//         onClick={handlePayment}
//         className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//       >
//         결제 진행
//       </button>
//     </div>
//   );
// };

// export default PaymentPage;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Redux에서 회원 정보 가져오기
import { useLocation, useNavigate } from "react-router-dom";
import { processPayment } from "../../api/paymentApi";

const PaymentPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const totalPrice = location.state?.totalPrice || 0;
	const time = location.state?.time || ""; // time 정보 받아오기

	// Redux에서 로그인한 회원 정보 가져오기
	const user = useSelector((state) => state.auth?.user);

	const email = user?.email || location.state?.email || "";
	const mId = user?.mId || location.state?.mId || "";
	// const userAddress = user?.adress || "서울시 강남구"; // 기본값으로 서울시 강남구 설정

	// 사용자 입력 상태
	const [phone, setPhone] = useState(""); // 전화번호
	const [address, setAddress] = useState(""); // 주소
	const [postcode, setPostcode] = useState(""); // 우편번호

	// 주소 초기화 (useEffect 사용)
	// useEffect(() => {
	// 	setAddress(userAddress); // Redux에서 가져온 주소를 기본값으로 설정
	// }, [userAddress]);

	const handlePayment = async () => {
		if (!email || !mId) {
			alert("로그인 정보를 확인해주세요.");
			return;
		}

		if (!phone || !postcode || !address) {
			alert("모든 정보를 입력해주세요.");
			return;
		}

		const merchantUid = `order_${new Date().getTime()}`; // 주문 번호 생성

		const IMP = window.IMP;
		IMP.init("");

		IMP.request_pay(
			{
				pg: "kakaopay",
				pay_method: "card",
				merchant_uid: merchantUid,
				name: location.state?.pname,
				time: location.state?.time,
				amount: totalPrice,
				buyer_email: email,
				buyer_name: mId,
				buyer_tel: phone,
				buyer_addr: address,
				buyer_postcode: postcode,
			},
			async (response) => {
				if (response.success) {
					const { imp_uid: impUid, merchant_uid: merchantUid } = response;

					try {
						const result = await processPayment({
							impUid,
							merchantUid,
							amount: totalPrice,
							memberEmail: email,
						});

						console.log(time);

						console.log("결제 처리 성공:", result);
						console.log("페이지 이동 시도");

						// 결제 성공 시 완료 페이지로 이동
						navigate("/payment/complete", {
							replace: true,
							state: {
								paymentInfo: {
									name: location.state?.pname,
									amount: totalPrice,
									orderDate: new Date().toLocaleDateString(),
									orderId: merchantUid,
									buyerName: mId,
									buyerEmail: email,
									pname: location.state?.pname || "장바구니 상품 결제", // 공연 이름 추가
									time: location.state?.time,
									capacity: location.state?.capacity || 1, // 인원 수 추가
								},
							},
						});
					} catch (error) {
						console.error("백엔드 결제 처리 실패:", error);
						alert("결제 처리 중 문제가 발생했습니다.");
					}
				} else {
					alert(`결제가 실패했습니다: ${response.error_msg}`);
				}
			},
		);
	};

	return (
		<div>
			<h1>결제하기</h1>
			<p>이메일 : {email}</p>
			<p>이름 : {mId}</p>
			<p>결제 금액: {totalPrice.toLocaleString()}원</p>
			<div>
				<label>
					전화번호:
					<input
						type="text"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						placeholder="전화번호를 입력하세요"
					/>
				</label>
			</div>
			<div>
				<label>
					주소:
					<input
						type="text"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						placeholder="주소를 입력하세요"
					/>
				</label>
			</div>
			<div>
				<label>
					우편번호:
					<input
						type="text"
						value={postcode}
						onChange={(e) => setPostcode(e.target.value)}
						placeholder="우편번호를 입력하세요"
					/>
				</label>
			</div>
			<button
				onClick={handlePayment}
				className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
				결제 진행
			</button>
		</div>
	);
};

export default PaymentPage;
