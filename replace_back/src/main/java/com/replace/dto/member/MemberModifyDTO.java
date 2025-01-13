package com.replace.dto.member;

import lombok.Data;

@Data
//회원 정보 수정
public class MemberModifyDTO {

    private String id; // m_id: 사용자 고유 ID

    private String pw; // 변경할 비밀번호

    private String nickname; // 변경할 닉네임

    private String address;

    private String phone;

    private boolean agreeEmail;
}
