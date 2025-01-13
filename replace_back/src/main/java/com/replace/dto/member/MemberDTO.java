package com.replace.dto.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@ToString
public class MemberDTO extends User {
    @NotBlank(message = "ID는 필수 입력 항목 입니다.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{4,}$",
            message = "ID는 최소 4자 이상, 문자와 숫자를 포함해야 합니다.")
    private String id; // m_id (사용자 고유 ID)

    @Email(message = "이메일 형식이 올바르지 않습니다.")
    @NotBlank(message = "Email은 필수 입력 항목 입니다.")
    private String email; // 사용자 이메일

    @NotBlank(message = "비밀번호는 필수 입력 항목 입니다.")

    private String pw; // 사용자 비밀번호

    @Pattern(regexp = "^[a-zA-Z0-9가-힣]{2,8}$", message = "닉네임은 2자에서 8자 이내여야 하며, 특수 문자를 포함할 수 없습니다.")
    @NotBlank(message = "닉네임은 필수 입니다.")

    private String nickname; // 사용자 닉네임

    @NotBlank(message = "주소는 필수 입력 항목 입니다")
    private String address;

    @NotBlank(message = "생년월일의 앞 6자리를 입력해주세요.")
    @Pattern(regexp = "^[0-9]{6}$", message = "생년월일은 숫자로 이루어진 6자리여야 합니다.")
    private String birthDate;

    private String phone;

    private boolean social; // 소셜 로그인 여부


    @Getter
    @Setter
    private boolean agreeEmail; // 이메일 동의 여부

    private List<String> roleNames =List.of("USER"); // 기본 권한 USER
    // 사용자 역할: USER 일반회원

    // 생성자: UserDetails를 상속받아 Security에서 인증 객체로 사용
    public MemberDTO(String id, String email,
                     String pw, String nickname,
                     boolean social, List<String> roleNames
                   )
    {
        super(
                id,                             // m_id
                pw,
                roleNames.stream()
                        .map(str -> new SimpleGrantedAuthority("ROLE_" + str)) // 권한 리스트
                        .collect(Collectors.toList()));

        this.id = id;
        this.email = email;
        this.pw = pw;
        this.nickname = nickname;
        this.social = social;
        this.roleNames= roleNames;



    }

    // 사용자 정보를 Map 형태로 반환
    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();

        dataMap.put("id", id); // m_id 추가
        dataMap.put("email", email);
        dataMap.put("pw", pw);
        dataMap.put("nickname", nickname);
        dataMap.put("social", social);
        dataMap.put("agreeEmail", agreeEmail);
        dataMap.put("roles", roleNames);


        return dataMap;
    }

}
