package com.replace.domain.goods;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;


@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(
        name = "goods_category",
        indexes = {
                @Index(name = "idx_goods_category_name", columnList = "goods_category_name")
        }
)
public class GoodsCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long goodsCategoryId; // 카테고리 고유 ID

    @Column(name = "goods_category_name", nullable = false, length = 30, unique = true)
    @NotNull
    @Size(min = 1, max = 30)
    private String goodsCategoryName; // 카테고리 이름

}

