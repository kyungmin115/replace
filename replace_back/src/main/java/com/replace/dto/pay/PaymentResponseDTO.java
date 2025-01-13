package com.replace.dto.pay;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponseDTO {
    private String impUid;
    private String merchantUid;
    private int amount;
    private String payMethod;
    private String status;
    private String paymentDate;
}

