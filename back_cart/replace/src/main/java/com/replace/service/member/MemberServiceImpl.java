package com.replace.service.member;

import com.replace.domain.member.Member;
import com.replace.domain.member.MemberRole;
import com.replace.dto.member.MemberDTO;
import com.replace.dto.MemberModifyDTO;
import com.replace.repository.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    private MemberDTO entityToDTO(Member member) {
        return new MemberDTO(
                member.getId(), // m_id
                member.getEmail(),
                member.getPw(),
                member.getNickname(),
                member.isSocial(),
                member.getMemberRoleList()
                        .stream()
                        .map(MemberRole::name)
                        .collect(Collectors.toList())
        );
    }

    // accesstoken을 기반으로 사용자의 정보를 얻기위한 메서드 (Kakao API 호출)
    private String getEmailFromKakaoAccessToken(String accessToken) {
        String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

        if (accessToken == null) {
            throw new RuntimeException("Access Token is null");
        }

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-Type", "application/x-www-form-urlencoded");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();

        ResponseEntity<LinkedHashMap> response =
                restTemplate.exchange(
                        uriBuilder.toString(),
                        HttpMethod.GET,
                        entity,
                        LinkedHashMap.class);

        log.info(response);

        LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();

        if (bodyMap == null || !bodyMap.containsKey("kakao_account")) {
            throw new RuntimeException("Kakao response invalid");
        }

        LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");

        log.info("kakaoAccount: " + kakaoAccount);

        return kakaoAccount.get("id");
    }

    // Kakao 고유 ID를 얻기 위한 메서드 (m_id로 활용)
    private String getIdFromKakaoAccessToken(String accessToken) {
        String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();

        ResponseEntity<LinkedHashMap> response =
                restTemplate.exchange(
                        uriBuilder.toString(),
                        HttpMethod.GET,
                        entity,
                        LinkedHashMap.class);

        LinkedHashMap<String, Object> bodyMap = response.getBody();

        if (bodyMap == null || !bodyMap.containsKey("id")) {
            throw new RuntimeException("Kakao response invalid");
        }

        String kakaoId = String.valueOf(bodyMap.get("id"));
        log.info("Kakao ID: " + kakaoId);

        return kakaoId;
    }

    // 임시 비밀번호를 생성하는 메서드
    private String makeTempPassword() {
        StringBuffer buffer = new StringBuffer();

        for (int i = 0; i < 10; i++) {
            buffer.append((char) ((int) (Math.random() * 55) + 65));
        }
        return buffer.toString();
    }

    // 소셜회원을 member에 넣기 위한 메서드
    private Member makeSocialMember(String kakaoId, String email) {
        String tempPassword = makeTempPassword();

        log.info("tempPassword: " + tempPassword);

        String nickname = "소셜회원";

        Member member = Member.builder()
                .id(kakaoId) // m_id로 설정
                .email(email)
                .pw(passwordEncoder.encode(tempPassword))
                .nickname(nickname)
                .social(true)
                .build();

        member.addRole(MemberRole.USER);

        return member;
    }

    @Override
    public MemberDTO getKakaoMember(String accessToken) {
        // AccessToken을 통해 사용자 고유 ID(Kakao ID) 가져오기
        String kakaoId = getIdFromKakaoAccessToken(accessToken);

        // m_id(Kakao ID)로 회원 조회
        Optional<Member> result = memberRepository.findById(kakaoId);

        // 기존 회원이 있다면 MemberDTO 반환
        if (result.isPresent()) {
            return entityToDTO(result.get());
        }

        // 새 소셜 회원 생성
        String email = getEmailFromKakaoAccessToken(accessToken);
        Member socialMember = makeSocialMember(kakaoId, email);
        memberRepository.save(socialMember);

        return entityToDTO(socialMember);
    }

    @Override
    public void checkDuplicate(String type, String value) {
        if ("id".equals(type) && memberRepository.existsById(value)) {
            throw new RuntimeException("이미 존재하는 ID입니다.");
        }
        if ("email".equals(type) && memberRepository.existsByEmail(value)) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        if ("nickname".equals(type) && memberRepository.existsByNickname(value)) {
            throw new RuntimeException("이미 존재하는 닉네임입니다.");
        }
    }


    @Override
    public void modifyMember(MemberModifyDTO memberModifyDTO) {
        // m_id를 기반으로 회원 정보 조회
        Optional<Member> result = memberRepository.findById(memberModifyDTO.getId());

        Member member = result.orElseThrow(() -> new RuntimeException("Member not found"));

        // 비밀번호, 소셜 여부, 닉네임 변경
        member.changePw(passwordEncoder.encode(memberModifyDTO.getPw()));
        member.changeNickname(memberModifyDTO.getNickname());
        member.changeSocial(false);

        memberRepository.save(member);
    }


    @Override
    public MemberDTO login(String id, String password) {
        // ID를 기반으로 회원 조회
        Optional<Member> result = memberRepository.findById(id);
        Member member = result.orElseThrow(() -> new RuntimeException("존재하지 않는 ID입니다."));

        // 비밀번호 검증
        if (!passwordEncoder.matches(password, member.getPw())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 로그인 성공 시 MemberDTO 반환
        return entityToDTO(member);
    }

    @Transactional
    @Override // 회원가입 시점에서 시행 전체 로직 담당
    public void registerMember(MemberDTO memberDTO) {

        if (memberDTO.getRoleNames() == null || memberDTO.getRoleNames().isEmpty()) {
            memberDTO.setRoleNames(List.of("USER"));
        }
        // m_id 중복 확인
        if (memberRepository.existsById(memberDTO.getId())) {
            throw new RuntimeException("이미 존재하는 ID 입니다");
        }
        //이메일 중복 확인
        if (memberRepository.existsByEmail(memberDTO.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        // 닉네임 중복 확인
        if (memberRepository.existsByNickname(memberDTO.getNickname())) {
            throw new RuntimeException("이미 존재하는 닉네임입니다.");
        }

        // 새 Member 엔티티 생성
        Member member = Member.builder()
                .id(memberDTO.getId()) // m_id
                .email(memberDTO.getEmail())
                .pw(passwordEncoder.encode(memberDTO.getPw())) // 비밀번호 암호화
                .nickname(memberDTO.getNickname())
                .address(memberDTO.getAddress())
                .phone(memberDTO.getPhone())

                .social(false) // 회원가입은 소셜 사용자가 아님
                .build();

        member.addRole(MemberRole.USER); //기본권한 USER추가


        log.info("Saving Member: " + member);
        memberRepository.save(member);
        log.info("Saved Member Successfully"); // 저장 후 로그 확인


    }
}
