package com.replace.domain.review;

import com.replace.domain.BaseEntity;
import com.replace.domain.goods.Goods;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "review")
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goodsId",referencedColumnName = "goods_id")
    private Goods goods;

    private String reviewTitle;

    private String reviewContent;

    private String reviewer;

    @Builder.Default
    private boolean delReviewFlag = false;

    // 별점
    private int rating;

    public void changeReviewDel(boolean delReviewFlag) {
        this.delReviewFlag = delReviewFlag;
    }

    @ElementCollection // 엔티티의 값 타입 컬렉션을 저장할 때 사용
    @Builder.Default
    private List<ReviewImage> imageList = new ArrayList<>();

    public void changeReviewTitle(String reviewTitle) {
        this.reviewTitle = reviewTitle;
    }

    public void changeReviewContent(String reviewContent) {
        this.reviewContent = reviewContent;
    }

    public void changeRating(int rating) {
        this.rating = rating;
    }

    public void addImage(ReviewImage image) {

        image.setOrd(this.imageList.size());
        imageList.add(image);
    }

    public void addImageString(String fileName) {

        ReviewImage reviewImage = ReviewImage.builder()
                .fileName(fileName)
                .build();
        addImage(reviewImage);
    }

    public void clearList() {
        this.imageList.clear();
    }

}
