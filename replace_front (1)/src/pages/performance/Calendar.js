// Calendar.jsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./scss/Calendar.scss";
import { ko } from "date-fns/locale";
import { processPayment } from "../../api/paymentApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Calendar = ({ performance }) => {
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState("");
	const [capacity, setCapacity] = useState(1);
	const [timeOptions, setTimeOptions] = useState([]);
	const [availableDates, setAvailableDates] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [selectedPrice, setSelectedPrice] = useState("");
	const [totalPrice, setTotalPrice] = useState(0);
	const { loginState, isLogin } = useCustomLogin();
	const navigate = useNavigate();

	// console.log(loginState);
	useEffect(() => {
		// IMP 초기화
		const script = document.createElement("script");
		script.src = "https://cdn.iamport.kr/v1/iamport.js";
		script.async = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	// useEffect(() => {
	// 	if (performance?.schedules) {
	// 		const uniqueDays = [
	// 			...new Set(performance.schedules.map((schedule) => schedule.day)),
	// 		];
	// 		setAvailableDates(uniqueDays);
	// 	}

	// 	if (performance?.startDate && performance?.endDate) {
	// 		setStartDate(new Date(performance.startDate));
	// 		setEndDate(new Date(performance.endDate));
	// 	}

	// 	if (performance?.price) {
	// 		const firstPrice = performance.price.includes("원,")
	// 			? performance.price.split("원,")[0].trim()
	// 			: performance.price;
	// 		setSelectedPrice(firstPrice);
	// 	}
	// }, [performance]);

	const extractPrice = (priceString) => {
		const matches = priceString.match(/\d+/g);
		return matches ? parseInt(matches.join("")) : 0;
	};

	useEffect(() => {
		const basePrice = extractPrice(selectedPrice);
		setTotalPrice(basePrice * capacity);
	}, [selectedPrice, capacity]);

	const handlePayment = async () => {
		// 필수 필드 검증
		if (!selectedDate || !selectedTime || !totalPrice) {
			alert("모든 예약 정보를 선택해주세요.");
			return;
		}

		const IMP = window.IMP;
		IMP.init("imp76468326"); // 실제 IMP 키로 교체 필요

		const merchantUid = `order_${new Date().getTime()}`;
		const formattedDate = selectedDate.toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		const data = {
			pg: "kakaopay",
			pay_method: "card",
			merchant_uid: merchantUid,
			name: `${performance.pname}`,
			time: `${formattedDate} ${selectedTime}`,
			amount: totalPrice,
			buyer_email: loginState.email, // 실제 로그인된 사용자 정보로 교체
			buyer_name: loginState.id,
			buyer_tel: loginState.phone,
		};

		IMP.request_pay(data, async function (rsp) {
			if (rsp.success) {
				try {
					const paymentResult = await processPayment({
						impUid: rsp.imp_uid,
						merchantUid: rsp.merchant_uid,
						amount: rsp.paid_amount,
						memberId: loginState.id, // 실제 사용자 아이디로 교체
					});

					console.log("결제 처리 성공:", paymentResult);
					console.log("페이지 이동 시도");

					// 결제 성공 시 완료 페이지로 이동
					navigate("/payment/complete", {
						replace: true, // 뒤로가기 방지
						state: {
							paymentInfo: {
								type: "ticket",
								name: data.name,
								amount: totalPrice,
								orderDate: new Date().toLocaleDateString(),
								orderId: merchantUid,
								buyerName: loginState.id,
								buyerEmail: loginState.email,
								pname: performance.pname,
								time: data.time,
								capacity: capacity,
							},
						},
					});

					alert("예약 및 결제가 완료되었습니다.");
					// 여기에 예약 완료 후 처리 로직 추가 (예: 예약 확인 페이지로 이동)
				} catch (error) {
					console.error("결제 처리 중 오류 발생:", error);
					alert("결제 처리 중 오류가 발생했습니다.");
				}
			} else {
				alert(`결제에 실패하였습니다. ${rsp.error_msg}`);
			}
		});
	};

	useEffect(() => {
		if (performance?.schedules) {
			const uniqueDays = [
				...new Set(performance.schedules.map((schedule) => schedule.day)),
			];
			setAvailableDates(uniqueDays);
		}

		if (performance?.startDate && performance?.endDate) {
			setStartDate(new Date(performance.startDate));
			setEndDate(new Date(performance.endDate));
		}

		// 초기 가격 설정
		if (performance?.price) {
			const firstPrice = performance.price.includes("원,")
				? performance.price.split("원,")[0].trim()
				: performance.price;
			setSelectedPrice(firstPrice);
		}
	}, [performance]);

	// 총 가격 계산 함수
	useEffect(() => {
		const basePrice = extractPrice(selectedPrice);
		setTotalPrice(basePrice * capacity);
	}, [selectedPrice, capacity]);

	const isDateAvailable = (date) => {
		const days = [
			"일요일",
			"월요일",
			"화요일",
			"수요일",
			"목요일",
			"금요일",
			"토요일",
		];
		const dayOfWeek = days[date.getDay()];
		return availableDates.includes(dayOfWeek);
	};

	const filterTimesByDate = (date) => {
		if (!date || !performance?.schedules) return [];
		const days = [
			"일요일",
			"월요일",
			"화요일",
			"수요일",
			"목요일",
			"금요일",
			"토요일",
		];
		const dayOfWeek = days[date.getDay()];
		return performance.schedules
			.filter((schedule) => schedule.day === dayOfWeek)
			.map((schedule) => schedule.time)
			.sort((a, b) => a.localeCompare(b));
	};

	const handleDateChange = (date) => {
		setSelectedDate(date);
		if (date) {
			const filtered = filterTimesByDate(date);
			setTimeOptions(filtered);
			setSelectedTime(filtered[0] || "");
		} else {
			setTimeOptions([]);
			setSelectedTime("");
		}
	};

	const renderMonthContent = (date) => {
		return `${date.getMonth() + 1}월`;
	};

	const renderHeader = ({
		date,
		decreaseMonth,
		increaseMonth,
		prevMonthButtonDisabled,
		nextMonthButtonDisabled,
	}) => (
		<div className="react-datepicker__header-custom">
			<button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
				&lt;
			</button>
			<span>
				{date.getFullYear()}년 {date.getMonth() + 1}월
			</span>
			<button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
				&gt;
			</button>
		</div>
	);

	const filterDate = (date) => {
		const isWithinRange =
			(!startDate || date >= startDate) && (!endDate || date <= endDate);
		const isAvailableDay = isDateAvailable(date);
		return isWithinRange && isAvailableDay;
	};

	return (
		<div className="datetime-picker">
			<div className="picker-section">
				<label>예약 일시</label>
				<DatePicker
					selected={selectedDate}
					onChange={handleDateChange}
					dateFormat="yyyy년 MM월 dd일"
					minDate={startDate}
					maxDate={endDate}
					locale={ko}
					placeholderText="날짜를 선택하세요"
					renderMonthContent={renderMonthContent}
					renderCustomHeader={renderHeader}
					filterDate={filterDate}
					dayClassName={(date) =>
						filterDate(date) ? "available-day" : "unavailable-day"
					}
				/>
			</div>

			<div className="picker-section">
				<label>예약 시간</label>
				{timeOptions.length > 0 ? (
					<select
						value={selectedTime}
						onChange={(e) => setSelectedTime(e.target.value)}>
						<option disabled value="">
							시간을 선택하세요
						</option>
						{timeOptions.map((time) => (
							<option key={time} value={time}>
								{time}
							</option>
						))}
					</select>
				) : (
					<p>
						{selectedDate
							? "선택한 날짜에 예약 가능한 시간이 없습니다."
							: "날짜를 먼저 선택해주세요."}
					</p>
				)}
			</div>

			<div className="picker-section">
				<label>인원수</label>
				<select
					value={capacity}
					onChange={(e) => setCapacity(Number(e.target.value))}>
					{[...Array(4)].map((_, i) => (
						<option key={i + 1} value={i + 1}>
							{i + 1}명
						</option>
					))}
				</select>
			</div>
			<div className="price-container">
				<h2>가격</h2>
				{performance.price ? (
					<select
						value={selectedPrice}
						onChange={(e) => setSelectedPrice(e.target.value)}>
						{performance.price.includes("원,") ? (
							performance.price.split("원,").map((item, index) => {
								const price = item.trim() + (item.trim().endsWith("원") ? "" : "원");
								return (
									<option key={index} value={price}>
										{price}
									</option>
								);
							})
						) : (
							<option value={performance.price}>{performance.price}</option>
						)}
					</select>
				) : (
					<span>가격 정보 없음</span>
				)}
			</div>
			<div className="total-price-container">
				<h2>총 가격 : </h2>
				<p className="total-price">{totalPrice.toLocaleString()}원</p>
			</div>
			<div>
				<button type="submit" className="submit-button" onClick={handlePayment}>
					결제하기
				</button>
			</div>
		</div>
	);
};

export default Calendar;
