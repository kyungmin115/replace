package com.replace.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemListDTO {

    private Long cartId;                 // Cart의 ID
    private String ownerId;           // 장바구니 소유자의 ID
    private int totalPrice;              // 장바구니 아이템 총 가격
    private int totalQuantity;           // 장바구니 아이템 총 수량
    private List<CartItemDTO> cartItemDTOList;     // 장바구니 아이템 리스트

}
