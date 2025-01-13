package com.replace.repository.cart;

import com.replace.domain.cart.Cart;
import com.replace.domain.cart.CartItem;
import com.replace.domain.goods.Goods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // 특정 카트에 속한 모든 CartItem 조회
    List<CartItem> findByCart(Cart cart);

    // 선택된 아이템들만 조회
    List<CartItem> findByCartAndSelectedTrue(Cart cart);

    // 카트에서 특정 카트아이템 삭제
    void deleteByCartCartId(Long cartId);

    // 특정 상품에 대한 카트아이템 조회
    Optional<CartItem> findByCartAndGoods(Cart cart, Goods goods);

}



