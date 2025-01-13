package com.replace.dto.pay;

import lombok.Data;

@Data
public class CancelApprovalRequestDTO {
    private String impUid;
    private boolean approve; // true: 승인, false: 거부
}
