package com.replace.service.review;

import com.replace.domain.goods.Goods;
import com.replace.domain.review.Review;
import com.replace.domain.review.ReviewImage;
import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;
import com.replace.dto.review.ReviewDTO;
import com.replace.repository.goods.GoodsRepository;
import com.replace.repository.review.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ModelMapper modelMapper;
    private final GoodsRepository goodsRepository;

    // 추가
    @Override
    public Long registerReview(ReviewDTO reviewDTO) {

        Review review = dtoToEntity(reviewDTO);

        Review result = reviewRepository.save(review);

        return result.getRid();
    }

    // 수정
    @Override
    public void modifyReview(ReviewDTO reviewDTO) {

        // read
        Optional<Review> result = reviewRepository.findById(reviewDTO.getRid());
        Review review = result.orElseThrow();

        // change
        review.changeReviewTitle(reviewDTO.getReviewTitle());
        review.changeReviewContent(reviewDTO.getReviewContent());
        review.changeRating(reviewDTO.getRating());

        // upload & clear
        review.clearList();

        List<String> uploadFileNames = reviewDTO.getUploadFileNames();

        if (uploadFileNames != null && uploadFileNames.size() > 0) {
            uploadFileNames.stream().forEach(uploadName -> {
                review.addImageString(uploadName);
            });
        }
        reviewRepository.save(review);
    }

    // 삭제
    @Override
    public void removeReview(Long rid) {

        reviewRepository.updateToDelete(rid, true);
    }

    // 조회
    @Override
    public PageResponseDTO<ReviewDTO> getListOfReview(Long goodsId, PageRequestDTO pageRequestDTO) {

        log.info("get list of review.......");

        Pageable pageable =
                PageRequest.of(pageRequestDTO.getPage() <=0? 0: pageRequestDTO.getPage() -1,
                        pageRequestDTO.getSize(),
                        Sort.by("rid").descending());

//        Page<Review> result = reviewRepository.listOfBoard(goodsId, pageable);
//        List<ReviewDTO> dtoList = result.getContent().stream().map(review ->
//                        modelMapper.map(review, ReviewDTO.class))
//                .collect(Collectors.toList());

        Page<Object[]> result = reviewRepository.selectList(goodsId, pageable);

        List<ReviewDTO> dtoList = result.get().map(arr -> {

            Review review = (Review) arr[0];
            ReviewImage reviewImage = (ReviewImage) arr[1];

            ReviewDTO reviewDTO = ReviewDTO.builder()
                    .rid(review.getRid())
                    .reviewer(review.getReviewer())
                    .reviewTitle(review.getReviewTitle())
                    .reviewContent(review.getReviewContent())
                    .goodsId(review.getGoods().getGoodsId())
                    .rating(review.getRating())
                    .createdAt(review.getCreatedAt())
                    .delReviewFlag(review.isDelReviewFlag())
                    .build();

            String imageStr = reviewImage.getFileName();
            reviewDTO.setUploadFileNames(List.of(imageStr));

            return reviewDTO;
        }).collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<ReviewDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .dtoList(dtoList)
                .totalCount((int)result.getTotalElements())
                .build();
    }

    @Override
    public ReviewDTO get(Long rid) {

        java.util.Optional<Review> result = reviewRepository.selectOne(rid);

        Review review = result.orElseThrow();

        ReviewDTO reviewDTO = entityToDTO(review);

        return reviewDTO;

    }

    @Override
    public ReviewDTO getReviewWithImages(Long rid) {
        // 엔티티 조회 (EntityGraph 사용)
        Review review = reviewRepository.selectOne(rid)
                .orElseThrow(() -> new IllegalArgumentException("Review not found: " + rid));

        // DTO로 변환
        return ReviewDTO.builder()
                .rid(review.getRid())
                .goodsId(review.getGoods().getGoodsId())
                .reviewContent(review.getReviewContent())
                .reviewTitle(review.getReviewTitle())
                .reviewer(review.getReviewer())
                .rating(review.getRating())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .uploadFileNames(
                        review.getImageList().stream()
                                .map(ReviewImage::getFileName)
                                .collect(Collectors.toList())
                )
                .build();
    }

    private Review dtoToEntity(ReviewDTO reviewDTO){

        // Goods 엔티티를 goodsId로 조회
        Goods goods = goodsRepository.findById(reviewDTO.getGoodsId())
                .orElseThrow(() -> new RuntimeException("Goods not found with id: " + reviewDTO.getGoodsId()));


        Review review = Review.builder()
                .rid(reviewDTO.getRid())
                .reviewTitle(reviewDTO.getReviewTitle())
                .reviewer(reviewDTO.getReviewer())
                .reviewContent(reviewDTO.getReviewContent())
                .goods(goods)
                .rating(reviewDTO.getRating())
                .build();

        //업로드 처리가 끝난 파일들의 이름 리스트
        List<String> uploadFileNames = reviewDTO.getUploadFileNames();

        if(uploadFileNames == null){
            return review;
        }

        uploadFileNames.stream().forEach(uploadName -> {

            review.addImageString(uploadName);
        });

        return review;
    }

    private ReviewDTO entityToDTO(Review review){

        ReviewDTO reviewDTO = ReviewDTO.builder()
                .rid(review.getRid())
                .reviewTitle(review.getReviewTitle())
                .reviewer(review.getReviewer())
                .reviewContent(review.getReviewContent())
                .rating(review.getRating())
                .goodsId(review.getGoods().getGoodsId())
                .build();

        List<ReviewImage> imageList = review.getImageList();

        if(imageList == null || imageList.size() == 0 ){
            return reviewDTO;
        }

        List<String> fileNameList = imageList.stream().map(reviewImage ->
                reviewImage.getFileName()).toList();

        reviewDTO.setUploadFileNames(fileNameList);

        return reviewDTO;
    }

    @Override
    public double calculateAverageRating(Long goodsId) {
        Double avgRating = reviewRepository.calculateAvgRatingByGoodsId(goodsId);
        return avgRating != null ? avgRating : 0.0;
    }
}

