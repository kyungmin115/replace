package com.replace.dto.goods;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    private Long cartItemId;       // CartItem의 ID
    private Long goodsId;          // Goods의 ID
    private String goodsName;      // Goods의 이름
    private String goodsImgUrl;  // Goods의 이미지 URL
    private String categoryName;   // Goods의 카테고리 이름
    private int goodsPrice;        // Goods의 가격
    private int quantity;          // 장바구니 아이템 수량
    private boolean selected;    // 선택 여부
}

