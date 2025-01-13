package com.replace.dto.pay;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Setter
@Getter
@AllArgsConstructor
public class PaymentHistoryDTO {
    private String impUid;
    private String merchantUid;
    private int amount;
    private LocalDateTime paymentDate; // 결제 날짜 추가
    private String status;            // 결제 상태 추가
    private String memberId;

}