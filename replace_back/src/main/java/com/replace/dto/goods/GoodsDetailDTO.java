package com.replace.dto.goods;

import com.replace.domain.goods.GoodsCategory;
import com.replace.domain.goods.GoodsStatus;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class GoodsDetailDTO {

    private Long goodsId;  // 굿즈 고유 ID
    private String goodsName;  // 굿즈 이름
    private int goodsPrice;  // 굿즈 가격
    private Integer goodsStock;  // 재고 수량
    private GoodsStatus goodsStatus;  // 굿즈 상태 (AVAILABLE, SOLD_OUT)
    private GoodsCategory goodsCategory;  // 굿즈 카테고리
    private String storeName;  // 판매자 이름
    private int viewsCount;  // 조회 수
    private String goodsImgUrl;  // 굿즈 이미지 URL

}





