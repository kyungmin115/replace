package com.replace.service.cart;

import com.replace.dto.cart.CartItemDTO;
import com.replace.dto.cart.CartItemListDTO;

import java.util.List;

public interface CartService {

    // 장바구니에 상품 추가 (이미 있으면 수량만 변경, 없으면 새로 추가)
    List<CartItemListDTO> addItemToCart(CartItemDTO cartItemDTO, String ownerId);

    // 장바구니에서 특정 아이템 삭제 (아이템 ID로 삭제)
    List<CartItemListDTO> removeItemFromCart(Long cartItemId, String ownerId);

    // 장바구니에서 선택된 아이템들만 삭제
    List<CartItemListDTO> removeSelectedItems(String ownerId);

    // 장바구니 상품 조회 (전체 아이템)
    List<CartItemListDTO> getCartItems(String ownerId);

    // 장바구니에서 모두 선택 or 해제
    List<CartItemListDTO> selectAllItems(boolean selectAll, String ownerId);

    // 장바구니 아이템 선택 상태 변경
    List<CartItemListDTO> updateItemSelection(Long cartItemId, boolean selected, String ownerId);

    int getTotalItemQuantity(String ownerId);
}
