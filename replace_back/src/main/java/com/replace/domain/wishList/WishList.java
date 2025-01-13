package com.replace.domain.wishList;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.replace.domain.member.Member;
import com.replace.domain.performance.PerformanceDetail;
import com.replace.domain.performance.PerformanceList;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Builder
@Table(name = "wishlist")
@AllArgsConstructor
@NoArgsConstructor
@Getter

//@ToString
public class WishList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "m_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pid", nullable = false)
    private PerformanceList performanceList;

    @Column(name = "created_at")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDate.now();
    }

    @Override
    public String toString() {
        return "WishList{id=" + id + ", member=" + (member != null ? member.getId() : "null") + "}";
    }


}
