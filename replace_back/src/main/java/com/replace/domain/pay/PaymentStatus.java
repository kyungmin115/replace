package com.replace.domain.pay;

public enum PaymentStatus {
    PENDING, //결제 요청 중
    SUCCESS, //결제 성공
    REFUND_REQUESTED, //환불 요청
    REFUNDED //환불
}
