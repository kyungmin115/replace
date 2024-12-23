import React, { useState, useEffect } from "react";
import "./scss/Calendar.scss";

const getDaysInMonth = (year, month) => {
	return new Date(year, month + 1, 0).getDate();
};

const Calendar = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [calendarDays, setCalendarDays] = useState([]);
	const [selectedDay, setSelectedDay] = useState(null);

	useEffect(() => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();

		const firstDayOfMonth = new Date(year, month, 1).getDay();
		const daysInMonth = getDaysInMonth(year, month);
		const daysInPrevMonth = getDaysInMonth(year, month - 1);

		const calendarArray = [];

		// 이전 달의 날짜 추가
		for (let i = firstDayOfMonth - 1; i >= 0; i--) {
			calendarArray.push({ day: daysInPrevMonth - i, currentMonth: false });
		}

		// 현재 달의 날짜 추가
		for (let i = 1; i <= daysInMonth; i++) {
			calendarArray.push({ day: i, currentMonth: true });
		}

		// 다음 달의 날짜 추가
		const remainingDays = 42 - calendarArray.length; // 6주 * 7일 = 42
		for (let i = 1; i <= remainingDays; i++) {
			calendarArray.push({ day: i, currentMonth: false });
		}

		setCalendarDays(calendarArray);
	}, [currentDate]);

	const handleNextMonth = () => {
		setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
		setSelectedDay(null);
	};

	const handlePrevMonth = () => {
		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth();

		// 현재 연도의 12월이 아닐 경우에만 이전 달로 이동
		if (!(currentYear === new Date().getFullYear() && currentMonth === 11)) {
			setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
			setSelectedDay(null);
		}
	};

	const handleDayClick = (day, currentMonth) => {
		if (currentMonth) {
			setSelectedDay({ day, month: currentDate.getMonth() });
		}
	};

	const isToday = (day) => {
		const today = new Date();
		return (
			currentDate.getFullYear() === today.getFullYear() &&
			currentDate.getMonth() === today.getMonth() &&
			day === today.getDate()
		);
	};

	const isPastDay = (day) => {
		const dayDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			day,
		);
		const today = new Date();
		return dayDate < today.setHours(0, 0, 0, 0);
	};

	return (
		<div className="calendar">
			<div className="calendar-header">
				<button
					onClick={handlePrevMonth}
					disabled={
						currentDate.getFullYear() === new Date().getFullYear() &&
						currentDate.getMonth() === 11
					}>
					&lt;
				</button>
				<span>
					{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
				</span>
				<button onClick={handleNextMonth}>&gt;</button>
			</div>

			<div className="calendar-body">
				<div className="weekdays">
					{["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
						<div
							key={day}
							className="weekday"
							style={{ color: index === 0 ? "red" : "inherit" }}>
							{day}
						</div>
					))}
				</div>

				<div className="calendar-grid">
					{calendarDays.map((dayObj, index) => (
						<div
							key={index}
							className={`calendar-day 
                ${!dayObj.currentMonth ? "other-month" : ""} 
                ${isToday(dayObj.day) ? "today" : ""} 
                ${
																	selectedDay &&
																	selectedDay.day === dayObj.day &&
																	selectedDay.month === currentDate.getMonth()
																		? "selected"
																		: ""
																}
                ${index % 7 === 0 ? "sunday" : ""}`}
							style={{
								backgroundColor:
									isPastDay(dayObj.day) && dayObj.currentMonth ? "#d3d3d3" : "",
								color:
									index % 7 === 0
										? "red"
										: isPastDay(dayObj.day) && dayObj.currentMonth
										? "#888"
										: "",
								cursor:
									isPastDay(dayObj.day) && dayObj.currentMonth
										? "not-allowed"
										: "pointer",
							}}
							onClick={() =>
								!isPastDay(dayObj.day) &&
								handleDayClick(dayObj.day, dayObj.currentMonth)
							}>
							{dayObj.day}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Calendar;
