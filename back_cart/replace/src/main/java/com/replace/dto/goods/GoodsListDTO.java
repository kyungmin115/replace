package com.replace.dto.goods;

import com.replace.domain.goods.GoodsStatus;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class GoodsListDTO {

    private Long goodsId;  // 상품 ID
    private String goodsName;  // 상품 이름
    private int goodsPrice;  // 상품 가격
    private String goodsImgUrl;  // 상품 이미지 URL
    private GoodsStatus goodsStatus;  // 상품 상태 (판매 중 / 품절 등)
    private String storeName;  // 판매자 이름
}


