import React, { useCallback, useState } from "react";
import "../../styles/qna/IndexPage.scss";
import { Link, Outlet, useNavigate } from "react-router-dom";
import BasicLayout from "../../layout/BasicLayout";
import useCustomLogin from "../../hooks/useCustomLogin";

const IndexPage = () => {
	const [activeQuestion, setActiveQuestion] = useState(null);

	const faqData = [
		{
			question: "티켓 배송 현황을 확인하고 싶어요.",
			answer: `
                예약 시 입력한 이메일을 통해 예매하신 티켓이 배송사에 도착 예정임을 알려드립니다.
                티켓은 배송 시작 후 5일 이내에 배송됩니다.(공휴일 제외, 영업일 기준)
                
                [ 배송 조회 방법 안내 ]
                • 알림톡 : 나의 예매내역 보기 > 상품선택 > 등기번호 배송 추적
                • 이메일 : 예매/배송조회 > 예매 상태 > 등기번호 확인 > 등기조회하기
                • 모바일 : 마이페이지 > 티켓예매/취소내역 > 상품선택 > 등기번호 배송 추적
                • PC : 마이페이지 > 예매내역 확인ㆍ취소 > 예매 상태 > 등기번호 확인 > 등기조회하기
                
                ※ 참고
                • 배송 조회는 배송 출발 익일 부터 배송이 시작되면 상세 조회가 가능합니다.
                • 배송사 사정에 따라 배송현황 업데이트 지연으로 인해 확인이 늦어질 수 있습니다.
            `,
		},
		{
			question: "티켓을 이미 우편배송 받았는데 취소하고 싶어요.",
			answer: `
                배송된 티켓의 취소는 불가능합니다. 단, 일부 상품의 경우 예외적으로 취소가 가능할 수 있습니다.
                자세한 사항은 고객센터로 문의해주세요.
            `,
		},
		{
			question: "예매한 티켓은 언제 배송되나요?",
			answer: `
                예매한 티켓은 공연일 기준 약 1주 전에 배송이 시작됩니다. 
                배송 시작 시, 등록된 이메일로 안내 드립니다.
            `,
		},
		{
			question: "부정적인 예매로 아이디가 제한되었다고 합니다. 어떻게 해야하나요?",
			answer: `
                아이디 제한은 부정적인 활동(예: 매크로 사용, 다량의 예매 취소 등)으로 인해 발생할 수 있습니다.
                고객센터로 문의하시어 상황에 대한 추가 정보를 요청하시기 바랍니다.
            `,
		},
		{
			question: "본인의 로그인 정보가 아닐 경우 어떻게 하나요?",
			answer: `
                비밀번호를 재설정하거나, 고객센터에 연락하여 계정 보호를 위한 추가 조치를 요청하시기 바랍니다.
            `,
		},
	];

	const { isLogin, moveToLogin } = useCustomLogin();

	const toggleQuestion = (index) => {
		setActiveQuestion(activeQuestion === index ? null : index);
	};

	const navigate = useNavigate();

	const handleClickAdd = useCallback(() => {
		if (!isLogin) {
			alert("로그인이 필요합니다.");
			moveToLogin();
			return;
		}
		navigate("/board/add");
	}, [isLogin, moveToLogin, navigate]);

	return (
		<div>
			<BasicLayout />
			<div className="faq-page">
				<h1 className="faq-title">고객님, 무엇을 도와드릴까요?</h1>
				<div className="faq-search-bar"></div>
				<div className="faq-categories">
					<button className="faq-category active">TOP Q&A</button>
				</div>
				<div className="faq-questions">
					{faqData.map((faq, index) => (
						<div key={index} className="faq-item">
							<div className="faq-question" onClick={() => toggleQuestion(index)}>
								<span>Q</span> {faq.question}
								<span className="faq-arrow">
									{activeQuestion === index ? "▲" : "▼"}
								</span>
							</div>
							{activeQuestion === index && (
								<div className="faq-answer">
									{faq.answer.split("\n").map((line, idx) => (
										<p key={idx}>{line}</p>
									))}
								</div>
							)}
						</div>
					))}
				</div>
				<div className="list-button-box">
					<Link to="/board/list">
						<button className="list-active">문의 목록 보기</button>
					</Link>
					<button className="list-active" onClick={handleClickAdd}>
						문의하기
					</button>
				</div>
			</div>
		</div>
	);
};

export default IndexPage;
