package com.replace.controller.cart;

import com.replace.dto.cart.CartItemDTO;
import com.replace.dto.cart.CartItemListDTO;
import com.replace.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Log4j2
@PreAuthorize("isAuthenticated()")
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // 장바구니에 아이템 추가
    @PostMapping("/add")
    public List<CartItemListDTO> addItemToCart(@RequestBody CartItemDTO cartItemDTO,
                                               Principal principal) {
        return cartService.addItemToCart(cartItemDTO, principal.getName());
    }

    // 장바구니 조회
    @GetMapping("/view")
    public List<CartItemListDTO> getCartItems(Principal principal) {
        return cartService.getCartItems(principal.getName());
    }

    // 장바구니 변경 (수량 변경)
    @PostMapping("/change")
    public List<CartItemListDTO> changeCart(@RequestBody CartItemDTO updatedCartItemDTO,
                                            Principal principal) {
        return cartService.addItemToCart(updatedCartItemDTO, principal.getName());
    }

    // 장바구니 아이템 선택 상태 변경
    @PutMapping("/updateSelection/{cartItemId}")
    public List<CartItemListDTO> updateItemSelection(@PathVariable Long cartItemId,
                                                     @RequestParam Boolean selected,
                                                     Principal principal) {
        return cartService.updateItemSelection(cartItemId, selected, principal.getName());
    }

    // 전체 선택/해제 처리
    @PutMapping("/selectAll")
    public List<CartItemListDTO> selectAllItems(@RequestParam Boolean selectAll, Principal principal) {
        return cartService.selectAllItems(selectAll, principal.getName());
    }

    // 장바구니 아이템 삭제
    @DeleteMapping("/remove/{cartItemId}")
    public List<CartItemListDTO> removeItemFromCart(@PathVariable Long cartItemId, Principal principal) {
        return cartService.removeItemFromCart(cartItemId, principal.getName());
    }

    // 선택한 아이템 삭제
    @DeleteMapping("/removeSelected")
    public List<CartItemListDTO> removeSelectedItems(Principal principal) {
        return cartService.removeSelectedItems(principal.getName());
    }

    // 장바구니 총 수량 조회
    @GetMapping("/totalQuantity")
    public int getTotalItemQuantity(Principal principal) {
        return cartService.getTotalItemQuantity(principal.getName());
    }
}

