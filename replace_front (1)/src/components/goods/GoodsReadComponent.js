import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	addItemToCartAsync,
	getTotalItemQuantityAsync,
} from "../../slices/cartSlice";
import useCustomLogin from "../../hooks/useCustomLogin";
import CustomModal from "../common/CustomModal";
import { processPayment } from "../../api/paymentApi";

const API_SERVER_HOST = "http://localhost:8080";

const GoodsReadComponent = ({ goods }) => {
	const {
		goodsId,
		goodsName,
		goodsPrice,
		goodsImgUrl,
		goodsStatus,
		goodsCategory,
		goodsStock,
	} = goods;
	const { isLogin, loginState, moveToLogin } = useCustomLogin();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// State 관리
	const [quantity, setQuantity] = useState(1);
	const [totalPrice, setTotalPrice] = useState(goodsPrice);
	const [isAdding, setIsAdding] = useState(false);
	const [isPaying, setIsPaying] = useState(false);
	const [paymentData, setPaymentData] = useState(null);

	// 리뷰와 관련된 코드 주석 처리
	/*
	const [review, setReview] = useState([]); // 리뷰 목록
	const [reviewTitle, setReviewTitle] = useState(""); // 리뷰 제목
	const [reviewContent, setReviewContent] = useState(""); // 리뷰 내용
	const [reviewFile, setReviewFile] = useState(null); // 리뷰 이미지 파일
	const [previewImage, setPreviewImage] = useState(null); // 리뷰 이미지 미리보기
	const [pageState, setPageState] = useState({ page: 1, size: 10 }); // 페이지 상태
	const [editingReview, setEditingReview] = useState(null);
	const [editTitle, setEditTitle] = useState("");
	const [editContent, setEditContent] = useState("");
	const [editFile, setEditFile] = useState(null);
	const [reviewRating, setReviewRating] = useState(0);
	const [editRating, setEditRating] = useState(0);
	
	useEffect(() => {
		fetchReviews();
	}, [pageState]);

	const fetchReviews = async () => {
		try {
			const data = await getReviewList(pageState, goods.goodsId);
			setReview(data.dtoList || []);
			console.log("리뷰 데이터: ", data.dtoList);
		} catch (error) {
			console.error("Failed to fetch reviews:", error);
		}
	};
	*/

	// IMP 초기화
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://cdn.iamport.kr/v1/iamport.js";
		script.async = true;
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	// 장바구니 아이템 확인
	const cartItems = useSelector((state) => state.cart.items);
	const existingItem =
		cartItems.length > 0 &&
		cartItems[0]?.cartItemDTOList?.find((item) => item.goodsId === goodsId);

	// 모달 컨트롤
	const [modalState, setModalState] = useState({
		login: false,
		addToCart: false,
		quantityChange: false,
		payment: false,
		paymentSuccess: false,
	});

	const openModal = (modalType) => {
		setModalState((prev) => ({ ...prev, [modalType]: true }));
	};

	const closeModal = (modalType) => {
		setModalState((prev) => ({ ...prev, [modalType]: false }));
	};

	const handleQuantityChange = (e) => {
		const newQuantity = Math.max(1, Math.min(e.target.value, goodsStock));
		setQuantity(newQuantity);
		setTotalPrice(newQuantity * goodsPrice);
	};

	const handlePaymentComplete = () => {
		closeModal("paymentSuccess");
		navigate("/payment/complete", {
			replace: true,
			state: {
				paymentInfo: paymentData,
			},
		});
	};

	// 결제 처리
	const handlePayment = async () => {
		if (!isLogin) {
			openModal("login");
			return;
		}

		setIsPaying(true);
		const IMP = window.IMP;
		IMP.init("");

		const merchantUid = `goods_${new Date().getTime()}`;

		const data = {
			pg: "kakaopay",
			pay_method: "card",
			merchant_uid: merchantUid,
			name: `${goodsName} - ${quantity}개`,
			amount: totalPrice,
			buyer_email: loginState.email,
			buyer_name: loginState.id,
			buyer_tel: loginState.phone,
		};

		try {
			IMP.request_pay(data, async function (rsp) {
				if (rsp.success) {
					try {
						const paymentResult = await processPayment({
							impUid: rsp.imp_uid,
							merchantUid: rsp.merchant_uid,
							amount: rsp.paid_amount,
							memberId: loginState.id,
						});

						console.log("결제 처리 성공:", paymentResult);

						// 결제 데이터 저장
						const paymentInfo = {
							type: "goods",
							name: goodsName,
							amount: totalPrice,
							orderDate: new Date().toLocaleDateString(),
							orderId: merchantUid,
							buyerName: loginState.id,
							buyerEmail: loginState.email,
						};
						setPaymentData(paymentInfo);

						// 결제 성공 모달 표시
						openModal("paymentSuccess");
					} catch (error) {
						console.error("결제 처리 중 오류 발생:", error);
						alert("결제 처리 중 오류가 발생했습니다.");
					}
				} else {
					alert(`결제에 실패하였습니다. ${rsp.error_msg}`);
				}
				setIsPaying(false);
			});
		} catch (error) {
			console.error("결제 요청 중 오류 발생:", error);
			alert("결제 요청 중 오류가 발생했습니다.");
			setIsPaying(false);
		}
	};

	const addToCart = async () => {
		const cartItemDTO = {
			goodsId,
			goodsName,
			goodsPrice,
			quantity,
			goodsImgUrl,
		};

		try {
			setIsAdding(true);
			const result = await dispatch(addItemToCartAsync(cartItemDTO)).unwrap();
			if (result) {
				await dispatch(getTotalItemQuantityAsync()).unwrap();
				closeModal("quantityChange");
				openModal("addToCart");
			}
		} catch (error) {
			alert("장바구니 추가 중 오류가 발생했습니다.");
			console.error("장바구니 추가 실패:", error);
		} finally {
			setIsAdding(false);
		}
	};

	const handleAddToCart = async () => {
		if (goodsStatus === "SOLD_OUT") return;

		if (!isLogin) {
			openModal("login");
			return;
		}

		if (existingItem) {
			openModal("quantityChange");
			return;
		}

		await addToCart();
	};

	const handleLoginConfirm = () => {
		closeModal("login");
		moveToLogin();
	};

	return (
		<>
			<div className="goods-detail-container">
				<div className="goods-image-container">
					<img src={goodsImgUrl} alt={goodsName} className="goods-image" />
				</div>

				<div className="details">
					<div className="goods-header">
						<h1>{goodsName}</h1>
						<span className="category">
							굿즈 &gt; {goodsCategory.goodsCategoryName}
						</span>
					</div>
					<div className="price-info">
						<p className="price">{goodsPrice.toLocaleString()} 원</p>
						<label htmlFor="quantity">수량 : </label>
						<input
							type="number"
							id="quantity"
							min="1"
							max={goodsStock}
							value={quantity}
							onChange={handleQuantityChange}
							disabled={goodsStatus === "SOLD_OUT"}
						/>
						&nbsp; 개
						<div className="total-price">
							<p>총 가격: {totalPrice.toLocaleString()} 원</p>
						</div>
					</div>
					{goodsStatus === "SOLD_OUT" ? (
						<div className="sold-out-message">품절된 상품입니다</div>
					) : (
						<div className="action-buttons">
							<button
								className="add-to-cart"
								onClick={handleAddToCart}
								disabled={isAdding || goodsStatus === "SOLD_OUT"}>
								{isAdding ? "추가 중..." : "장바구니에 추가"}
							</button>
							<button
								className="buy-now"
								onClick={handlePayment}
								disabled={isPaying || goodsStatus === "SOLD_OUT"}>
								{isPaying ? "결제 중..." : "바로 구매"}
							</button>
						</div>
					)}
				</div>

				{/* 로그인 모달 */}
				<CustomModal
					isOpen={modalState.login}
					onClose={() => closeModal("login")}
					title="로그인 확인"
					buttons={
						<>
							<button onClick={() => closeModal("login")} className="cancel-btn">
								닫기
							</button>
							<button onClick={handleLoginConfirm} className="confirm-btn">
								로그인
							</button>
						</>
					}>
					<p>로그인이 필요합니다.</p>
					<p>RE:PLACE에 로그인하고 내 취향을 찾아보세요!</p>
				</CustomModal>

				{/* 결제 성공 모달 */}
				<CustomModal
					isOpen={modalState.paymentSuccess}
					onClose={() => closeModal("paymentSuccess")}
					title="결제 완료"
					buttons={
						<button onClick={handlePaymentComplete} className="confirm-btn">
							확인
						</button>
					}>
					<p>결제가 성공적으로 완료되었습니다!</p>
				</CustomModal>

				{/* 장바구니 모달 */}
				<CustomModal
					isOpen={modalState.addToCart}
					onClose={() => closeModal("addToCart")}
					title="장바구니 추가 완료"
					buttons={
						<>
							<button onClick={() => navigate("/cart")} className="go-to-cart-btn">
								장바구니로 가기
							</button>
							<button
								onClick={() => closeModal("addToCart")}
								className="continue-shopping-btn">
								계속 쇼핑하기
							</button>
						</>
					}>
					<p>상품이 장바구니에 추가되었습니다!</p>
				</CustomModal>

				<CustomModal
					isOpen={modalState.quantityChange}
					onClose={() => closeModal("quantityChange")}
					title="수량 변경 확인"
					buttons={
						<>
							<button onClick={addToCart} className="confirm-btn">
								확인
							</button>
							<button
								onClick={() => closeModal("quantityChange")}
								className="cancel-btn">
								취소
							</button>
						</>
					}>
					<p>장바구니에 이미 담긴 상품입니다.</p>
					<p>수량을 변경하시겠습니까?</p>
				</CustomModal>
			</div>
		</>
	);
};

export default GoodsReadComponent;

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
// 	addItemToCartAsync,
// 	getTotalItemQuantityAsync,
// } from "../../slices/cartSlice";
// import {
// 	getReviewList,
// 	modifyReview,
// 	registerReview,
// 	removeReview,
// 	reviewImage,
// } from "../../api/goodsApi";
// import useCustomLogin from "../../hooks/useCustomLogin";
// import CustomModal from "../common/CustomModal";
// import { processPayment } from "../../api/paymentApi";
// import StarRatings from "react-star-ratings/build/star-ratings";

// const API_SERVER_HOST = "http://localhost:8080";

// const GoodsReadComponent = ({ goods }) => {
// 	const {
// 		goodsId,
// 		goodsName,
// 		goodsPrice,
// 		goodsImgUrl,
// 		goodsStatus,
// 		goodsCategory,
// 		goodsStock,
// 	} = goods;
// 	const { isLogin, loginState, moveToLogin } = useCustomLogin();
// 	const dispatch = useDispatch();
// 	const navigate = useNavigate();

// 	// State 관리
// 	const [quantity, setQuantity] = useState(1);
// 	const [totalPrice, setTotalPrice] = useState(goodsPrice);
// 	const [isAdding, setIsAdding] = useState(false);
// 	const [isPaying, setIsPaying] = useState(false);
// 	const [paymentData, setPaymentData] = useState(null);
// 	const [review, setReview] = useState([]); // 리뷰 목록
// 	const [reviewTitle, setReviewTitle] = useState(""); // 리뷰 제목
// 	const [reviewContent, setReviewContent] = useState(""); // 리뷰 내용
// 	const [reviewFile, setReviewFile] = useState(null); // 리뷰 이미지 파일
// 	const [previewImage, setPreviewImage] = useState(null); // 리뷰 이미지 미리보기
// 	const [pageState, setPageState] = useState({ page: 1, size: 10 }); // 페이지 상태
// 	const [editingReview, setEditingReview] = useState(null);
// 	const [editTitle, setEditTitle] = useState("");
// 	const [editContent, setEditContent] = useState("");
// 	const [editFile, setEditFile] = useState(null);
// 	const [reviewRating, setReviewRating] = useState(0);
// 	const [editRating, setEditRating] = useState(0);

// 	// 리뷰 데이터 가져오기
// 	useEffect(() => {
// 		fetchReviews();
// 	}, [pageState]);

// 	const fetchReviews = async () => {
// 		try {
// 			const data = await getReviewList(pageState, goods.goodsId);
// 			setReview(data.dtoList || []);
// 			console.log("리뷰 데이터: ", data.dtoList);
// 		} catch (error) {
// 			console.error("Failed to fetch reviews:", error);
// 		}
// 	};

// 	// 리뷰 작성
// 	const handleReviewSubmit = async () => {
// 		if (!reviewTitle.trim() || !reviewContent.trim()) {
// 			alert("리뷰 제목과 내용을 모두 입력해주세요.");
// 			return;
// 		}

// 		const reviewDTO = new FormData();
// 		reviewDTO.append("reviewTitle", reviewTitle);
// 		reviewDTO.append("reviewContent", reviewContent);
// 		reviewDTO.append("goodsId", goods.goodsId);
// 		reviewDTO.append("rating", reviewRating);
// 		reviewDTO.append("reviewer", loginState?.id);
// 		if (reviewFile) {
// 			reviewDTO.append("files", reviewFile);
// 		}

// 		// 데이터 확인용 로그
// 		for (let [key, value] of reviewDTO.entries()) {
// 			console.log(`${key}: ${value}`);
// 		}

// 		try {
// 			// registerReview 호출 (FormData를 처리할 수 있도록 구현되어야 함)
// 			await registerReview(reviewDTO);

// 			// 성공 시 상태 초기화
// 			setReviewTitle("");
// 			setReviewContent("");
// 			setReviewFile(null);
// 			setReviewRating(0);
// 			setPreviewImage(null);
// 			fetchReviews(); // 리뷰 목록 갱신
// 		} catch (error) {
// 			console.error("리뷰 등록 실패:", error);
// 			alert("리뷰 등록에 실패했습니다. 다시 시도해주세요.");
// 		}
// 	};

// 	// 파일 선택 및 미리보기
// 	const handleFileChange = (e) => {
// 		const file = e.target.files[0];
// 		setReviewFile(file);

// 		// 미리보기 설정
// 		const reader = new FileReader();
// 		reader.onloadend = () => {
// 			setPreviewImage(reader.result);
// 		};
// 		if (file) {
// 			reader.readAsDataURL(file);
// 		}
// 	};

// 	// 리뷰 수정 모드 진입
// 	const handleEditMode = (review) => {
// 		if (review.reviewer !== loginState?.id) {
// 			alert("본인이 작성한 리뷰만 수정할 수 있습니다.");
// 			return;
// 		}
// 		setEditingReview(review);
// 		setEditTitle(review.reviewTitle);
// 		setEditContent(review.reviewContent);
// 		setEditRating(review.rating);
// 		setPreviewImage(review.image);
// 	};

// 	// 리뷰 수정 제출
// 	const handleEditSubmit = async () => {
// 		if (!editTitle.trim() || !editContent.trim() || editRating === 0) {
// 			alert("제목과 내용을 모두 입력해주세요.");
// 			return;
// 		}

// 		const reviewDTO = new FormData();
// 		reviewDTO.append("reviewTitle", editTitle);
// 		reviewDTO.append("reviewContent", editContent);
// 		reviewDTO.append("goodsId", goods.goodsId);
// 		reviewDTO.append("rating", editRating);
// 		reviewDTO.append("reviewer", loginState?.id);
// 		if (editFile) {
// 			reviewDTO.append("files", editFile);
// 		}
// 		console.log(reviewRating);

// 		try {
// 			await modifyReview(editingReview.rid, reviewDTO);
// 			setEditingReview(null);
// 			fetchReviews();
// 			alert("리뷰가 수정되었습니다.");
// 		} catch (error) {
// 			console.error("리뷰 수정 실패:", error);
// 			alert("리뷰 수정에 실패했습니다.");
// 		}
// 	};

// 	// 리뷰 삭제
// 	const handleDeleteReview = async (rid) => {
// 		if (window.confirm("리뷰를 삭제하시겠습니까?")) {
// 			try {
// 				await removeReview(rid);
// 				fetchReviews();
// 				alert("리뷰가 삭제되었습니다.");
// 			} catch (error) {
// 				console.error("리뷰 삭제 실패:", error);
// 				alert("리뷰 삭제에 실패했습니다.");
// 			}
// 		}
// 	};

// 	// 모달 상태 관리
// 	const [modalState, setModalState] = useState({
// 		login: false,
// 		addToCart: false,
// 		quantityChange: false,
// 		payment: false,
// 		paymentSuccess: false,
// 	});

// 	// IMP 초기화
// 	useEffect(() => {
// 		const script = document.createElement("script");
// 		script.src = "https://cdn.iamport.kr/v1/iamport.js";
// 		script.async = true;
// 		document.body.appendChild(script);

// 		return () => {
// 			document.body.removeChild(script);
// 		};
// 	}, []);

// 	// 장바구니 아이템 확인
// 	const cartItems = useSelector((state) => state.cart.items);
// 	const existingItem =
// 		cartItems.length > 0 &&
// 		cartItems[0]?.cartItemDTOList?.find((item) => item.goodsId === goodsId);

// 	// 모달 컨트롤
// 	const openModal = (modalType) => {
// 		setModalState((prev) => ({ ...prev, [modalType]: true }));
// 	};

// 	const closeModal = (modalType) => {
// 		setModalState((prev) => ({ ...prev, [modalType]: false }));
// 	};

// 	const handleQuantityChange = (e) => {
// 		const newQuantity = Math.max(1, Math.min(e.target.value, goodsStock));
// 		setQuantity(newQuantity);
// 		setTotalPrice(newQuantity * goodsPrice);
// 	};

// 	const handlePaymentComplete = () => {
// 		closeModal("paymentSuccess");
// 		navigate("/payment/complete", {
// 			replace: true,
// 			state: {
// 				paymentInfo: paymentData,
// 			},
// 		});
// 	};

// 	// 결제 처리
// 	const handlePayment = async () => {
// 		if (!isLogin) {
// 			openModal("login");
// 			return;
// 		}

// 		setIsPaying(true);
// 		const IMP = window.IMP;
// 		IMP.init("imp76468326");

// 		const merchantUid = `goods_${new Date().getTime()}`;

// 		const data = {
// 			pg: "kakaopay",
// 			pay_method: "card",
// 			merchant_uid: merchantUid,
// 			name: `${goodsName} - ${quantity}개`,
// 			amount: totalPrice,
// 			buyer_email: loginState.email,
// 			buyer_name: loginState.id,
// 			buyer_tel: loginState.phone,
// 		};

// 		try {
// 			IMP.request_pay(data, async function (rsp) {
// 				if (rsp.success) {
// 					try {
// 						const paymentResult = await processPayment({
// 							impUid: rsp.imp_uid,
// 							merchantUid: rsp.merchant_uid,
// 							amount: rsp.paid_amount,
// 							memberId: loginState.id,
// 						});

// 						console.log("결제 처리 성공:", paymentResult);

// 						// 결제 데이터 저장
// 						const paymentInfo = {
// 							type: "goods",
// 							name: goodsName,
// 							amount: totalPrice,
// 							orderDate: new Date().toLocaleDateString(),
// 							orderId: merchantUid,
// 							buyerName: loginState.id,
// 							buyerEmail: loginState.email,
// 						};
// 						setPaymentData(paymentInfo);

// 						// 결제 성공 모달 표시
// 						openModal("paymentSuccess");
// 					} catch (error) {
// 						console.error("결제 처리 중 오류 발생:", error);
// 						alert("결제 처리 중 오류가 발생했습니다.");
// 					}
// 				} else {
// 					alert(`결제에 실패하였습니다. ${rsp.error_msg}`);
// 				}
// 				setIsPaying(false);
// 			});
// 		} catch (error) {
// 			console.error("결제 요청 중 오류 발생:", error);
// 			alert("결제 요청 중 오류가 발생했습니다.");
// 			setIsPaying(false);
// 		}
// 	};

// 	const addToCart = async () => {
// 		const cartItemDTO = {
// 			goodsId,
// 			goodsName,
// 			goodsPrice,
// 			quantity,
// 			goodsImgUrl,
// 		};

// 		try {
// 			setIsAdding(true);
// 			const result = await dispatch(addItemToCartAsync(cartItemDTO)).unwrap();
// 			if (result) {
// 				await dispatch(getTotalItemQuantityAsync()).unwrap();
// 				closeModal("quantityChange");
// 				openModal("addToCart");
// 			}
// 		} catch (error) {
// 			alert("장바구니 추가 중 오류가 발생했습니다.");
// 			console.error("장바구니 추가 실패:", error);
// 		} finally {
// 			setIsAdding(false);
// 		}
// 	};

// 	const handleAddToCart = async () => {
// 		if (goodsStatus === "SOLD_OUT") return;

// 		if (!isLogin) {
// 			openModal("login");
// 			return;
// 		}

// 		if (existingItem) {
// 			openModal("quantityChange");
// 			return;
// 		}

// 		await addToCart();
// 	};

// 	const handleLoginConfirm = () => {
// 		closeModal("login");
// 		moveToLogin();
// 	};

// 	return (
// 		<>
// 			<div className="goods-detail-container">
// 				<div className="goods-image-container">
// 					<img src={goodsImgUrl} alt={goodsName} className="goods-image" />
// 				</div>

// 				<div className="details">
// 					<div className="goods-header">
// 						<h1>{goodsName}</h1>
// 						<span className="category">
// 							굿즈 &gt; {goodsCategory.goodsCategoryName}
// 						</span>
// 					</div>
// 					<div className="price-info">
// 						<p className="price">{goodsPrice.toLocaleString()} 원</p>
// 						<label htmlFor="quantity">수량 : </label>
// 						<input
// 							type="number"
// 							id="quantity"
// 							min="1"
// 							max={goodsStock}
// 							value={quantity}
// 							onChange={handleQuantityChange}
// 							disabled={goodsStatus === "SOLD_OUT"}
// 						/>
// 						&nbsp; 개
// 						<div className="total-price">
// 							<p>총 가격: {totalPrice.toLocaleString()} 원</p>
// 						</div>
// 					</div>
// 					{goodsStatus === "SOLD_OUT" ? (
// 						<div className="sold-out-message">품절된 상품입니다</div>
// 					) : (
// 						<div className="action-buttons">
// 							<button
// 								className="add-to-cart"
// 								onClick={handleAddToCart}
// 								disabled={isAdding || goodsStatus === "SOLD_OUT"}>
// 								{isAdding ? "추가 중..." : "장바구니에 추가"}
// 							</button>
// 							<button
// 								className="buy-now"
// 								onClick={handlePayment}
// 								disabled={isPaying || goodsStatus === "SOLD_OUT"}>
// 								{isPaying ? "결제 중..." : "바로 구매"}
// 							</button>
// 						</div>
// 					)}
// 				</div>

// 				{/* 로그인 모달 */}
// 				<CustomModal
// 					isOpen={modalState.login}
// 					onClose={() => closeModal("login")}
// 					title="로그인 확인"
// 					buttons={
// 						<>
// 							<button onClick={() => closeModal("login")} className="cancel-btn">
// 								닫기
// 							</button>
// 							<button onClick={handleLoginConfirm} className="confirm-btn">
// 								로그인
// 							</button>
// 						</>
// 					}>
// 					<p>로그인이 필요합니다.</p>
// 					<p>RE:PLACE에 로그인하고 내 취향을 찾아보세요!</p>
// 				</CustomModal>

// 				{/* 결제 성공 모달 */}
// 				<CustomModal
// 					isOpen={modalState.paymentSuccess}
// 					onClose={() => closeModal("paymentSuccess")}
// 					title="결제 완료"
// 					buttons={
// 						<button onClick={handlePaymentComplete} className="confirm-btn">
// 							확인
// 						</button>
// 					}>
// 					<p>결제가 성공적으로 완료되었습니다!</p>
// 				</CustomModal>

// 				{/* 장바구니 모달 */}
// 				<CustomModal
// 					isOpen={modalState.addToCart}
// 					onClose={() => closeModal("addToCart")}
// 					title="장바구니 추가 완료"
// 					buttons={
// 						<>
// 							<button onClick={() => navigate("/cart")} className="go-to-cart-btn">
// 								장바구니로 가기
// 							</button>
// 							<button
// 								onClick={() => closeModal("addToCart")}
// 								className="continue-shopping-btn">
// 								계속 쇼핑하기
// 							</button>
// 						</>
// 					}>
// 					<p>상품이 장바구니에 추가되었습니다!</p>
// 				</CustomModal>

// 				<CustomModal
// 					isOpen={modalState.quantityChange}
// 					onClose={() => closeModal("quantityChange")}
// 					title="수량 변경 확인"
// 					buttons={
// 						<>
// 							<button onClick={addToCart} className="confirm-btn">
// 								확인
// 							</button>
// 							<button
// 								onClick={() => closeModal("quantityChange")}
// 								className="cancel-btn">
// 								취소
// 							</button>
// 						</>
// 					}>
// 					<p>장바구니에 이미 담긴 상품입니다.</p>
// 					<p>수량을 변경하시겠습니까?</p>
// 				</CustomModal>
// 			</div>

// 			{/* 리뷰 섹션 */}
// 			{/* 리뷰 섹션 업데이트 */}
// 			<div className={"review-header-section"}>
// 				<div className="reviews-section">
// 					<h2>리뷰</h2>
// 					<ul className="review-list">
// 						{review.length > 0 ? (
// 							review.map((review) => (
// 								<li key={review.rid} className="review-item">
// 									{editingReview?.rid === review.rid ? (
// 										// 수정 모드 UI
// 										<div className="review-edit-form">
// 											<input
// 												type="text"
// 												value={editTitle}
// 												onChange={(e) => setEditTitle(e.target.value)}
// 												className="review-edit-title"
// 											/>
// 											<textarea
// 												value={editContent}
// 												onChange={(e) => setEditContent(e.target.value)}
// 												className="review-edit-content"
// 											/>
// 											<StarRatings
// 												rating={editRating}
// 												starRatedColor="gold"
// 												changeRating={(newRating) => setEditRating(newRating)}
// 												numberOfStars={5}
// 												name="edit-rating"
// 												starDimension="24px"
// 												starSpacing="2px"
// 											/>
// 											<input
// 												type="file"
// 												accept="image/*"
// 												onChange={(e) => {
// 													const file = e.target.files[0];
// 													setEditFile(file);
// 													const reader = new FileReader();
// 													reader.onloadend = () => {
// 														setPreviewImage(reader.result);
// 													};
// 													if (file) {
// 														reader.readAsDataURL(file);
// 													}
// 												}}
// 												className="review-edit-image"
// 											/>
// 											{previewImage && (
// 												<img
// 													src={previewImage}
// 													alt="미리보기"
// 													className="review-image-preview"
// 												/>
// 											)}
// 											<div className="review-edit-buttons">
// 												<button onClick={handleEditSubmit} className="save-btn">
// 													저장
// 												</button>
// 												<button
// 													onClick={() => setEditingReview(null)}
// 													className="cancel-btn">
// 													취소
// 												</button>
// 											</div>
// 										</div>
// 									) : (
// 										// 일반 리뷰 표시 UI
// 										<div className="review-content">
// 											<div className="review-box">
// 												<div>
// 													<span className="reviewer">{review.reviewer || "익명"}</span>
// 													<span className="review-date">{review.createdAt || "N/A"}</span>
// 													<div>
// 														<h3>{review.reviewTitle}</h3>
// 														<p>{review.reviewContent}</p>

// 														<StarRatings
// 															rating={Number(review.rating)}
// 															starRatedColor="gold"
// 															starDimension="20px"
// 															starSpacing="1px"
// 															numberOfStars={5}
// 															name={`review-rating-${review.rid}`}
// 														/>
// 														<div className="review-actions">
// 															<button
// 																onClick={() => handleEditMode(review)}
// 																className="edit-btn">
// 																수정
// 															</button>
// 															<button
// 																onClick={() => handleDeleteReview(review.rid)}
// 																className="delete-btn">
// 																삭제
// 															</button>
// 														</div>
// 													</div>
// 												</div>
// 												<div className="product-image-container">
// 													<div></div>
// 													<img
// 														alt="image"
// 														className="product-image"
// 														src={`${API_SERVER_HOST}/api/goods/view/${review.uploadFileNames[0]}`}
// 													/>
// 												</div>
// 											</div>
// 										</div>
// 									)}
// 								</li>
// 							))
// 						) : (
// 							<p>리뷰가 없습니다.</p>
// 						)}
// 					</ul>
// 					{/* 리뷰 작성 */}
// 					{isLogin ? (
// 						<div className="review-form">
// 							<input
// 								type="text"
// 								placeholder="리뷰 제목을 입력하세요"
// 								value={reviewTitle}
// 								onChange={(e) => setReviewTitle(e.target.value)}
// 								className="review-title-input"
// 							/>
// 							<textarea
// 								placeholder="리뷰 내용을 입력하세요"
// 								value={reviewContent}
// 								onChange={(e) => setReviewContent(e.target.value)}
// 								className="review-textarea"
// 							/>
// 							<StarRatings
// 								rating={reviewRating}
// 								starRatedColor="gold"
// 								changeRating={(newRating) => setReviewRating(newRating)}
// 								numberOfStars={5}
// 								name="review-rating"
// 								starDimension="24px"
// 								starSpacing="2px"
// 							/>
// 							<input
// 								type="file"
// 								accept="image/*"
// 								onChange={handleFileChange}
// 								className="review-image-input"
// 							/>
// 							{previewImage && (
// 								<img
// 									src={previewImage}
// 									alt="미리보기"
// 									className="review-image-preview"
// 								/>
// 							)}
// 							<button onClick={handleReviewSubmit} className="review-submit-btn">
// 								리뷰 작성
// 							</button>
// 						</div>
// 					) : (
// 						<p>리뷰를 작성하려면 로그인이 필요합니다.</p>
// 					)}
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default GoodsReadComponent;
