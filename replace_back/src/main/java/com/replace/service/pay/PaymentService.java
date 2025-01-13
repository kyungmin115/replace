package com.replace.service.pay;

import com.replace.domain.member.Member;
import com.replace.domain.pay.Payment;
import com.replace.domain.pay.PaymentStatus;
import com.replace.dto.pay.PaymentHistoryDTO;
import com.replace.dto.pay.PaymentRequestDTO;
import com.replace.repository.member.MemberRepository;
import com.replace.repository.pay.PaymentHistoryRepository;
import com.replace.repository.pay.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final MemberRepository memberRepository;

    @Transactional
//    public PaymentResponseDTO processPayment(PaymentRequestDTO request, Member member) throws IOException, IOException {
//        String token = portoneService.getAccessToken();
//
//        // 포트원 결제 검증
//        portoneService.validatePayment(request.getImpUid(), request.getAmount(), token);
//
//        // 결제 정보 저장
//        Payment payment = Payment.builder()
//                .member(member)
//                .impUid(request.getImpUid())
//                .merchantUid(request.getMerchantUid())
//                .amount(request.getAmount())
//                .payMethod("kakaopay")
//                .status("paid")
//                .paymentDate(LocalDateTime.now())
//                .build();
//
//        paymentRepository.save(payment);
//
//        // 결제 내역 저장
//        PaymentHistory paymentHistory = PaymentHistory.builder()
//                .member(member)
//                .payment(payment)
//                .createdDate(LocalDateTime.now())
//                .build();
//
//        paymentHistoryRepository.save(paymentHistory);
//
//        return new PaymentResponseDTO(
//                payment.getImpUid(),
//                payment.getMerchantUid(),
//                payment.getAmount(),
//                payment.getPayMethod(),
//                payment.getStatus(),
//                payment.getPaymentDate().toString()
//        );
//    }
    public void processPayment(PaymentRequestDTO paymentRequest) {
        // 예: Member 조회
        Member member = memberRepository.findById(paymentRequest.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("해당 회원을 찾을 수 없습니다."));

        System.out.println("조회된 회원: " + member);
        // 결제 정보 저장
        Payment payment = Payment.builder()
                .member(member)
                .impUid(paymentRequest.getImpUid())
                .merchantUid(paymentRequest.getMerchantUid())
                .amount(paymentRequest.getAmount())
                .payMethod("card") // 임의로 설정
                .status(PaymentStatus.SUCCESS) // 임의로 설정
                .paymentDate(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);
    }

    public void savePayment(PaymentRequestDTO paymentRequest) {
        // 회원 이메일을 통해 회원 찾기
        Member member = memberRepository.findById(paymentRequest.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        // Payment 엔티티 생성 및 저장
        Payment payment = Payment.builder()
                .member(member)
                .impUid(paymentRequest.getImpUid())
                .merchantUid(paymentRequest.getMerchantUid())
                .amount(paymentRequest.getAmount())
                .payMethod("카드")
                .status(PaymentStatus.SUCCESS) // 기본 상태: 결제 완료
                .paymentDate(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);
    }

    @Transactional
    public void cancelPayment(String impUid) {
        Payment payment = paymentRepository.findByImpUid(impUid)
                .orElseThrow(() -> new IllegalArgumentException("결제를 찾을 수 없습니다."));

        if (payment.getStatus() != PaymentStatus.REFUND_REQUESTED) {
            throw new IllegalStateException("취소 요청 상태가 아닙니다.");
        }

        payment.setStatus(PaymentStatus.REFUNDED); // 최종 승인 처리
        payment.setCancelDate(LocalDateTime.now());
        paymentRepository.save(payment);
    }

    public List<PaymentHistoryDTO> getPaymentHistory(String id) {
        return paymentRepository.findByMemberId(id)
                .stream()
                .map(payment -> new PaymentHistoryDTO(
                        payment.getImpUid(),
                        payment.getMerchantUid(),
                        payment.getAmount(),
                        payment.getPaymentDate(),
                        payment.getStatus().name(),
                        id
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void requestCancelPayment(String impUid, String id) {
        Payment payment = paymentRepository.findByImpUidAndMemberId(impUid, id)
                .orElseThrow(() -> new IllegalArgumentException("결제를 찾을 수 없습니다."));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new IllegalStateException("취소 요청은 성공 상태의 결제만 가능합니다.");
        }

        payment.setStatus(PaymentStatus.REFUND_REQUESTED);
        paymentRepository.save(payment);
    }

    public List<PaymentHistoryDTO> getUserCancelRequests(String id) {
        return paymentRepository.findByMemberIdAndStatus(id, PaymentStatus.REFUND_REQUESTED)
                .stream()
                .map(payment -> new PaymentHistoryDTO(
                        payment.getImpUid(),
                        payment.getMerchantUid(),
                        payment.getAmount(),
                        payment.getPaymentDate(),
                        payment.getStatus().name(),
                        id
                ))
                .collect(Collectors.toList());
    }


    @Transactional
    public void processCancelRequest(String impUid, boolean approve) {
        Payment payment = paymentRepository.findByImpUid(impUid)
                .orElseThrow(() -> new IllegalArgumentException("결제를 찾을 수 없습니다."));

        if (payment.getStatus() != PaymentStatus.REFUND_REQUESTED) {
            throw new IllegalStateException("취소 요청 상태가 아닙니다.");
        }

        if (approve) {
            // 결제 취소 승인
            payment.setStatus(PaymentStatus.REFUNDED);
            // 실제 결제 취소 로직 추가 (e.g., PG사 API 호출)
        } else {
            // 결제 취소 요청 거부
            payment.setStatus(PaymentStatus.SUCCESS); // 기존 상태로 복원
        }

        paymentRepository.save(payment);
    }

    public List<PaymentHistoryDTO> getAdminCancelRequests() {
        return paymentRepository.findAllByStatus(PaymentStatus.REFUND_REQUESTED)
                .stream()
                .map(payment -> new PaymentHistoryDTO(
                        payment.getImpUid(),
                        payment.getMerchantUid(),
                        payment.getAmount(),
                        payment.getPaymentDate(),
                        payment.getStatus().name(),
                        payment.getMember().getId()
                ))
                .collect(Collectors.toList());
    }




}
