package com.replace.dto.admin;

import lombok.Data;
import java.util.List;

@Data
public class EmailRequestDTO {
    private List<String> memberEmails; // 이메일 주소 리스트
    private String subject;            // 이메일 제목
    private String body;               // 이메일 본문
}
