package com.replace.domain.cart;

import com.replace.domain.goods.Goods;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString(exclude = "cart")
@Table(
        name = "cart_item",
        indexes = {
                @Index(columnList = "cart_id", name = "idx_cart_item_cart"),
                @Index(columnList = "goods_id, cart_id", name = "idx_cart_item_goods_id_cart")
        }
)
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartItemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) // Lazy로딩과 Null 방지
    @JoinColumn(name = "goods_id", nullable = false)
    private Goods goods;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) // Lazy로딩과 Null 방지
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @Column(name = "cart_item_quantity", nullable = false, columnDefinition = "INT DEFAULT 1")
    private int cartItemQuantity;

    @Column(name = "cart_item_selected", nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private boolean selected;

    // 수량 변경 메서드
    public void changeQuantity(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("수량은 1개 이상이어야 합니다.");
        }
        this.cartItemQuantity = quantity;
    }

    // 선택 상태 변경 메서드
    public void changeSelected(boolean selected) {
        this.selected = selected;
    }

    // 상품 가격 계산 (상품 가격 * 수량)
    public int getTotalPrice() {
        return this.goods.getGoodsPrice() * this.cartItemQuantity;
    }

}
