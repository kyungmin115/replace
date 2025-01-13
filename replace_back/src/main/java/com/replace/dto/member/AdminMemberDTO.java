package com.replace.dto.member;

import com.replace.domain.member.Member;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminMemberDTO {

    private String id;         // 사용자 ID
    private String email;      // 이메일
    private String nickname;   // 닉네임
    private List<String> roles; // 역할 리스트
    private boolean agreeEmail; // 이메일 수신 동의 여부

    // Member -> AdminMemberDTO 변환
    public static AdminMemberDTO fromEntity(Member member) {
        return new AdminMemberDTO(
                member.getId(),
                member.getEmail(),
                member.getNickname(),
                member.getMemberRoleList().stream()
                        .map(Enum::name)
                        .collect(Collectors.toList()),
                member.isAgreeEmail() // boolean 값 반환
        );
    }
}
