package com.replace.security;

import com.replace.domain.member.Member;
import com.replace.dto.member.MemberDTO;
import com.replace.repository.member.MemberRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;
@Getter
@Service
@Log4j2
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        log.info("----------------loadUserByUsername-----------------------------");
        log.info("Username (m_id): " + username);

        // m_id를 기준으로 사용자와 권한 정보 조회
        Member member = memberRepository.getWithRoles(username);

        // member가 없을 경우 예외 처리
        if (member == null) {
            log.error("User not found for m_id: " + username);
            throw new UsernameNotFoundException("Not Found: " + username);
        }

        log.info("Member found: " + member);

        // MemberDTO 생성
        MemberDTO memberDTO = new MemberDTO(
                member.getId(), // m_id
                member.getEmail(), // email
                member.getPw(), // password
                member.getNickname(), // nickname
                member.isSocial(), // social login 여부
                member.getMemberRoleList()
                        .stream()
                        .map(memberRole -> memberRole.name()) // Enum 값을 문자열로 변환
                        .collect(Collectors.toList())); // 권한 리스트 수집

        log.info("Converted MemberDTO: " + memberDTO);

        return memberDTO;
    }
}
