package com.replace.dto.review;

import com.replace.dto.PageResponseDTO;
import com.replace.dto.goods.GoodsDetailDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewListAllDTO {

    private GoodsDetailDTO goodsDetailDTO;
    private PageResponseDTO<ReviewDTO> reviews;

    private Long goodsId;
    private String reviewTitle;
    private String reviewContent;
    private String reviewer;
    private LocalDateTime createdAt;
    private int rating;

}
