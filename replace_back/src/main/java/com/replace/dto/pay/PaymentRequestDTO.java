package com.replace.dto.pay;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private String memberId;
    private String impUid; // 포트원 결제 고유 번호
    private String merchantUid; // 주문 번호
    private int amount; // 총 결제 금액
//    private String payMethod;
}
