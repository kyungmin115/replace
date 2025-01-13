package com.replace.controller.pay;

import com.replace.dto.pay.PaymentHistoryDTO;
import com.replace.dto.pay.PaymentRequestDTO;
import com.replace.service.pay.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Log4j2
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/checkout")
//    public ResponseEntity<?> processPayment(@RequestBody PaymentRequestDTO paymentRequest) {
//        // 요청 데이터 검증
//        if (paymentRequest.getImpUid() == null || paymentRequest.getMerchantUid() == null || paymentRequest.getAmount() <= 0) {
//            return ResponseEntity.badRequest().body("유효하지 않은 결제 요청입니다.");
//        }
//
//        // 결제 처리 로직 (예제)
//        try {
//            System.out.println("결제 요청 데이터: " + paymentRequest);
//            // 결제 검증 로직 추가
//            return ResponseEntity.ok("결제 요청이 성공적으로 처리되었습니다.");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 처리 중 오류 발생");
//        }
//    }
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequestDTO paymentRequest) {
        log.info("===컨트롤러 도달===");
        log.info("요청 데이터 : " + paymentRequest);
        if (paymentRequest == null || paymentRequest.getImpUid() == null || paymentRequest.getMerchantUid() == null) {
            return ResponseEntity.badRequest().body("유효하지 않은 결제 요청입니다.");
        }

        try {
            System.out.println("결제 요청 데이터: " + paymentRequest);

            // 실제 결제 처리
            paymentService.processPayment(paymentRequest);

            return ResponseEntity.ok("결제가 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 처리 중 오류 발생: " + e.getMessage());
        }
    }


    @GetMapping("/history")
//    public ResponseEntity<?> getHistory(@AuthenticationPrincipal Member member) {
//        return ResponseEntity.ok(paymentService.getPaymentHistory(member));
//    }
//    public ResponseEntity<List<PaymentHistoryDTO>> getPaymentHistory(@RequestParam String email) {
//        List<PaymentHistoryDTO> history = paymentService.getPaymentHistory(email);
//        return ResponseEntity.ok(history);
//    }
    public ResponseEntity<List<PaymentHistoryDTO>> getPaymentHistory(Principal principal) {
        if (principal == null) {
            throw new IllegalArgumentException("로그인된 사용자가 아닙니다.");
        }

        String email = principal.getName(); // 인증된 사용자의 이메일
        log.info("Authenticated email: {}", email);

        List<PaymentHistoryDTO> history = paymentService.getPaymentHistory(email);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cancelPayment(@RequestParam String impUid) {
        try {
            paymentService.cancelPayment(impUid);
            return ResponseEntity.ok("결제가 취소되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("결제 취소 중 오류 발생: " + e.getMessage());
        }
    }

    @PostMapping("/cancel/request")
    public ResponseEntity<?> requestCancelPayment(@RequestParam String impUid, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String email = principal.getName();

        try {
            paymentService.requestCancelPayment(impUid, email);
            return ResponseEntity.ok("결제 취소 요청이 접수되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("결제 취소 요청 중 오류 발생: " + e.getMessage());
        }
    }

    @GetMapping("/cancel/requests")
    public ResponseEntity<List<PaymentHistoryDTO>> getUserCancelRequests(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String email = principal.getName();
        List<PaymentHistoryDTO> requests = paymentService.getUserCancelRequests(email);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/cancel/approve")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> approveCancelPayment(@RequestParam("impUid") String impUid, @RequestParam("approve") boolean approve) {
        log.info("Received impUid: {}", impUid);
        log.info("Received approve: {}", approve);
        try {
            paymentService.processCancelRequest(impUid, approve);
            String message = approve ? "결제 취소가 승인되었습니다." : "결제 취소 요청이 거부되었습니다.";
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("결제 취소 처리 중 오류 발생: " + e.getMessage());
        }
    }

    @GetMapping("/admin/cancel/requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentHistoryDTO>> getAllCancelRequests() {
        List<PaymentHistoryDTO> requests = paymentService.getAdminCancelRequests();
        log.info("Admin Cancel Requests: {}", requests);
        return ResponseEntity.ok(requests);
    }




}
