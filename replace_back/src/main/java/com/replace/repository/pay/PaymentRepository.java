package com.replace.repository.pay;

import com.replace.domain.pay.Payment;
import com.replace.domain.pay.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT p FROM Payment p WHERE p.member.id = :id")
    List<Payment> findByMemberId(@Param("id") String id);

    Optional<Payment> findByImpUid(String impUid);

    @Query("SELECT p FROM Payment p WHERE p.impUid = :impUid AND p.member.id = :id")
    Optional<Payment> findByImpUidAndMemberId(@Param("impUid") String impUid, @Param("id") String id);

    // 취소 요청 상태인 결제 조회 (관리자용)
    @Query("SELECT p FROM Payment p WHERE p.status = :status")
    List<Payment> findAllByStatus(PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.member.id = :id AND p.status = :status")
    List<Payment> findByMemberIdAndStatus(@Param("id") String id, @Param("status") PaymentStatus status);

    // 상태 업데이트 (취소 요청 승인/거부 시 사용)
    @Modifying
    @Query("UPDATE Payment p SET p.status = :status WHERE p.impUid = :impUid")
    void updateStatusByImpUid(@Param("status") PaymentStatus status, @Param("impUid") String impUid);
}

