package com.replace.domain.goods;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "goodsCategory")
@Table(
        name = "goods",
        indexes = {
                @Index(name = "idx_goods_name", columnList = "goods_name"),
                @Index(name = "idx_goods_status", columnList = "goods_status"),
                @Index(name = "idx_goods_category", columnList = "goods_category_id")
        }
)
public class Goods extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long goodsId; // 굿즈 고유 ID

    @Column(name = "goods_name", nullable = false, length = 100)
    private String goodsName; // 굿즈 이름

    @Column(name = "goods_price", nullable = false, columnDefinition = "INT DEFAULT 0")
    private int goodsPrice; // 굿즈 가격

    @Column(name = "goods_stock", columnDefinition = "INT DEFAULT 0")
    private Integer goodsStock; // 재고 수량 (NULL일 경우 0)

    @Enumerated(EnumType.STRING)
    @Column(name = "goods_status", nullable = false, columnDefinition = "VARCHAR(10) DEFAULT 'AVAILABLE'")
    private GoodsStatus goodsStatus; // 굿즈 상태 (ENUM 사용)

    @Column(name = "goods_img_url", length = 2083)
    private String goodsImgUrl; // 굿즈 이미지 URL

    @Column(name = "store_name", length = 100)
    private String storeName; // 판매자 이름 (NULL 가능)

    @Column(name = "views_count", nullable = false, columnDefinition = "INT DEFAULT 0")
    private int viewsCount; // 조회수

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goods_category_id", nullable = false)
    private GoodsCategory goodsCategory; // 외래키 관계

    // 상품의 조회수를 증가시키는 메서드
    public void incrementViewCount() {
        this.viewsCount++;
    }

}
