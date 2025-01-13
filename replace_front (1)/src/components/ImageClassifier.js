import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import { Link } from "react-router-dom";
import { getGoodsByName } from "../api/goodsApi";
import "../styles/ImageClassifier.scss";

const ImageClassifier = ({ onClose }) => {
	const [model, setModel] = useState(null);
	const [labels, setLabels] = useState([]);
	const [prediction, setPrediction] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [searchResult, setSearchResult] = useState(null);
	const [isSearching, setIsSearching] = useState(false);
	const fileInputRef = useRef(null);

	// 모델 로드
	useEffect(() => {
		const loadModelAndLabels = async () => {
			try {
				// 모델 로드
				const model = await tf.loadLayersModel("/model/model.json");
				setModel(model);
				console.log("Model loaded successfully!");

				// 레이블 JSON 로드
				const response = await fetch("/labels.json");
				const labelsData = await response.json();
				setLabels(labelsData);
			} catch (error) {
				console.error("Error loading model or labels:", error);
			}
		};
		loadModelAndLabels();
	}, []);

	// 이미지 전처리
	const preprocessImage = (image) => {
		return tf.tidy(() => {
			let tensor = tf.browser
				.fromPixels(image)
				.resizeNearestNeighbor([224, 224]) // 입력 크기 맞춤
				.toFloat()
				.div(tf.scalar(255)); // 0~1로 정규화
			return tensor.expandDims(0); // 배치 차원 추가
		});
	};

	// 예측 실행
	const predict = async () => {
		if (!selectedFile || !model || labels.length === 0) {
			alert("모델이 로드되지 않았거나 파일이 선택되지 않았습니다.");
			return;
		}

		setSearchResult(null);
		const imageElement = new Image();
		imageElement.src = URL.createObjectURL(selectedFile);

		imageElement.onload = async () => {
			const inputTensor = preprocessImage(imageElement);
			const predictions = await model.predict(inputTensor).data(); // 확률 배열
			const predictedClassIndex = predictions.indexOf(Math.max(...predictions));
			const predictedLabel = labels[predictedClassIndex]; // 레이블 변환

			setPrediction(predictedLabel); // 예측 결과 저장
			inputTensor.dispose(); // 메모리 정리

			await searchProduct(predictedLabel);
		};
	};

	const searchProduct = async (productName) => {
		if (!productName) return;

		setIsSearching(true);
		try {
			console.log(productName);
			const goodsId = await getGoodsByName(productName);

			setSearchResult(goodsId);
		} catch (error) {
			console.error("상품 검색 중 오류 발생:", error);
			alert("상품 검색 중 오류가 발생했습니다.");
		} finally {
			setIsSearching(false);
		}
	};

	// 파일 선택 핸들러
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
		setPrediction(null);
		setSearchResult(null);
	};

	return (
		<div className="image-classifier">
			<div className="image-classifier-header">
				<h3>굿즈 이미지 검색</h3>
			</div>

			<input
				type="file"
				accept="image/*"
				ref={fileInputRef}
				onChange={handleFileChange}
				className="file-input"
			/>

			{selectedFile && (
				<div className="preview-container">
					<img
						src={URL.createObjectURL(selectedFile)}
						alt="Uploaded preview"
						className="preview-image"
					/>
				</div>
			)}

			<div className="image-classifier-button-group">
				<button
					onClick={predict}
					disabled={!selectedFile}
					className="search-button">
					검색
				</button>
				<button className="close-button" onClick={onClose}>
					취소
				</button>
			</div>

			{prediction && (
				<div className="result-container">
					<p>
						검색 결과: <strong>{prediction}</strong>
					</p>
					{searchResult && (
						<Link to={`/goods/${searchResult}`} className="detail-link">
							상세보기
						</Link>
					)}
				</div>
			)}
		</div>
	);
};

export default ImageClassifier;
