package com.replace.security;

import com.replace.domain.member.Member;
import com.replace.domain.member.MemberRole;
import com.replace.repository.member.MemberRepository;
import com.replace.security.dto.MemberSecurityDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override// OAuth2 사용자 정보를 로드하는 메서드.
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        log.info("userRequest...........");
        log.info(userRequest);

        log.info("oauth2 user..................................");

        // OAuth2UserRequest 에서 클라이언트 등록 정보를 가져온다.
        ClientRegistration clientRegistration = userRequest.getClientRegistration();
        String clientName = clientRegistration.getClientName();// 클라언트 이름을 받아온다.

        log.info("NAME: " + clientName);
        // OAuth2 사용자 정보를 로드하는 메서드
        OAuth2User oAuth2User = super.loadUser(userRequest);
        // OAuth2사용자 정보를 map타입으로 가져온다.
        Map<String, Object> paramMap = oAuth2User.getAttributes();

        String id = null;

        switch (clientName){
            case "kakao":
                id = getKakaoEmail(paramMap);
                break;
        }
        log.info("=================================");
        log.info(id);
        log.info("=================================");

        return generateDTO(id, paramMap);
    }

    // 카카오에서 얻어온 이메일을 이용해서 같은 이메일을 가진 사용자를 찾아보고 없는 경우에는 자동으로 회원가입을 하고 MemberSecurityDTO 로 반환하도록 구성.
    private MemberSecurityDTO generateDTO(String id, Map<String, Object> params){

        Optional<Member> result = memberRepository.findById(id);

        //데이터베이스에 해당 이메일을 사용자가 없다면
        if(result.isEmpty()){
            //회원 추가 -- mid는 이메일 주소/ 패스워드는 1111
            Member member = Member.builder()
                    .id(id)
                    .pw(passwordEncoder.encode("1111"))
                    .social(true)
                    .build();
            member.addRole(MemberRole.USER);
            memberRepository.save(member);

            //MemberSecurityDTO 구성 및 반환
            MemberSecurityDTO memberSecurityDTO =
                    new MemberSecurityDTO(id, "1111",id,false, true, Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")));
            memberSecurityDTO.setProps(params);

            return memberSecurityDTO;
        }else { // 데이터베이스에 해당 이메일 사용자가 있다면
            Member member = result.get();
            MemberSecurityDTO memberSecurityDTO =
                    new MemberSecurityDTO(
                            member.getId(),
                            member.getPw(),
                            member.getEmail(),
                            member.isDeleted(),
                            member.isSocial(),
                            member.getMemberRoleList()
                                    .stream().map(memberRole -> new SimpleGrantedAuthority("ROLE_"+memberRole.name()))
                                    .collect(Collectors.toList())
                    );

            return memberSecurityDTO;
        }
    }

    // Map 타입을 -> String으로
    private String getKakaoEmail(Map<String, Object> paramMap){

        log.info("KAKAO-----------------------------------------");

        Object value = paramMap.get("kakao_account");

        log.info(value);

        LinkedHashMap accountMap = (LinkedHashMap) value;

        String email = (String)accountMap.get("email");

        log.info("email..." + email);

        return email;
    }
}
