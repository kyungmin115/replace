package com.replace.repository.cart;

import com.replace.domain.cart.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    // 이메일을 기준으로 회원의 장바구니 조회
    Optional<Cart> findByOwnerId(String ownerId);
}
