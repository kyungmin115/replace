import React from "react";
import "./MainPage.scss";
import BasicLayout from "../layout/BasicLayout";

const MainPage = () => {
    return (
        <BasicLayout>
            {/*nav 영역*/}
            <nav className="nav-container">
                <div className="nav-content">
                    <div className="nav-title">
                        <h1>RE:PLACE STORE</h1>
                        <h2>#단독 이벤트</h2>
                        <p>다양한 분야의 아티스트와 협업한 특별한 굿즈를 소개합니다</p>
                        <button className="see-more-btn">See More</button>
                    </div>
                    <div className="nav-carousel">
                        <button className="carousel-btn left">{`<`}</button>
                        <div className="carousel-image">
                            <img
                                src="https://via.placeholder.com/300x150"
                                alt="크리스마스 트리 이미지"
                            />
                        </div>
                        <button className="carousel-btn right">{`>`}</button>
                    </div>
                </div>
                <div className="photo-review-section">
                    <h3>공연</h3>
                    <div className="photo-cards">
                        <div className="card">
                            <img src="https://via.placeholder.com/300x150" alt="상품1" />
                            <p>공연 1</p>
                            <span>19,600원</span>
                        </div>
                        <div className="card">
                            <img src="https://via.placeholder.com/300x150" alt="상품2" />
                            <p>공연 2</p>
                            <span>33,500원</span>
                        </div>
                        <div className="card">
                            <img src="https://via.placeholder.com/300x150" alt="상품3" />
                            <p>공연 3</p>
                            <span>21,200원</span>
                        </div>
                        <div className="card">
                            <img src="https://via.placeholder.com/300x150" alt="상품4" />
                            <p>공연 4</p>
                            <span>25,000원</span>
                        </div>
                    </div>
                    <button className="see-more-btn">매달의 리뷰 보기</button>
                </div>
                <div className="photo-review-section">
                    <h3>굿즈</h3>
                    <div className="photo-cards">
                        <div className="card">
                            <img src="https://via.placeholder.com/300x150" alt="상품1" />
                            <p>굿즈 1</p>
                            <span>19,600원</span>
                        </div>
                        <div className="card">
                            <img src="https://via.placeholder.com/300x150" alt="상품2" />
                            <p>굿즈 2</p>
                            <span>33,500원</span>
                        </div>
                        <div className="card">
                            <img src="https://via.placeholder.com/300x150" alt="상품3" />
                            <p>굿즈 3</p>
                            <span>21,200원</span>
                        </div>
                        <div className="card">
                            <img src="https://via.placeholder.com/300x150" alt="상품4" />
                            <p>굿즈 4</p>
                            <span>25,000원</span>
                        </div>
                    </div>
                    <button className="see-more-btn">매달의 리뷰 보기</button>
                </div>
            </nav>
            {/*footer 영역*/}
            <footer className="footer-container">
                {/* 상단 섹션 */}
                <div className="footer-content">
                    {/* 왼쪽 컨택트 정보 */}
                    <div className="footer-contact">
                        <h2>Contact.</h2>
                        <p>
                            지역에 맞는 색을 입혀 특별한 가치를 창조하고, 지역과 청년 모두에게
                            새로운 방향을 제시하는 리플레이스와 함께하세요.
                        </p>
                        <ul>
                            <li>📍 경북 문경시 산업연 불암길 20, 2층</li>
                            <li>📞 Tel. 054-555-1623</li>
                            <li>📠 Fax. 070-5256-3999</li>
                            <li>📧 E-mail. replace724@naver.com</li>
                            <li>
                                📷 <a href="#instagram">Instagram</a>
                            </li>
                        </ul>
                    </div>

                    {/* 오른쪽 폼 */}
                    <div className="footer-form">
                        <form>
                            <input type="text" placeholder="이름 *" required />
                            <input type="email" placeholder="이메일 *" required />
                            <input type="text" placeholder="전화번호 *" required />
                            <textarea placeholder="내용" rows="4" required></textarea>
                            <div className="footer-privacy">
                                <input type="checkbox" id="privacy" required />
                                <label htmlFor="privacy">개인정보처리방침에 동의합니다. [내용보기]</label>
                            </div>
                            <button type="submit" className="send-btn">SEND</button>
                        </form>
                    </div>
                </div>

                {/* 하단 섹션 */}
                <div className="footer-bottom">
                    <p>
                        개인정보처리방침 | 사이트맵
                        <br />
                        주식회사 리플레이스(RE:PLACE) | 대표자: 도원우 | 사업자등록번호: 580-86-01566
                        <br />
                        주소: 경북 문경시 산업연 불암길 20, 2층 | Tel. 054-555-1623 | Fax. 070-5256-3999
                        | E-mail. replace724@naver.com
                    </p>
                    <p>Copyright © RE:PLACE. All rights Reserved. Design by Threeway</p>
                    <div className="footer-logo">RE:PLACE</div>
                </div>
            </footer>
        </BasicLayout>
    );
};

export default MainPage;