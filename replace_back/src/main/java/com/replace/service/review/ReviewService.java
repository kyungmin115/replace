package com.replace.service.review;

import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;
import com.replace.dto.review.ReviewDTO;

public interface ReviewService {

    Long registerReview(ReviewDTO reviewDTO);
    void modifyReview(ReviewDTO reviewDTO);
    void removeReview(Long rid);
    ReviewDTO get(Long rid);

    ReviewDTO getReviewWithImages(Long rid);

    // 상품 평균 별점 계산
    double calculateAverageRating(Long goodsId);

    // 게시물의 리뷰 목록을 페이징 처리해서 조회
    PageResponseDTO<ReviewDTO> getListOfReview(Long pid, PageRequestDTO pageRequestDTO);
}
