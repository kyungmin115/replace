package com.replace.domain.goods;

import com.replace.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "owner")
@Table(
        name = "cart",
        indexes = {@Index(name = "idx_cart_owner", columnList = "cart_owner")}
)
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartId;

    @OneToOne(fetch = FetchType.LAZY, optional = false) // Lazy 로딩 및 Null 방지
    @JoinColumn(name = "cart_owner", referencedColumnName = "m_id", nullable = false, unique = true)
    private Member owner;
}
