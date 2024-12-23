package com.replace.controller.member;

import com.replace.dto.member.MemberDTO;
import com.replace.service.member.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @PostMapping("/login")//로그인
    public ResponseEntity<?> login(@RequestBody MemberDTO memberDTO) {
        try {
            MemberDTO loggedInMember = memberService.login(memberDTO.getId(), memberDTO.getPw());
            return ResponseEntity.ok(loggedInMember);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }


    @PostMapping("/register")//회원가입
    public ResponseEntity<?> register(@RequestBody @Valid MemberDTO memberDTO) {
        try {
            memberService.registerMember(memberDTO);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "회원가입 성공"
            ));
        } catch (RuntimeException e) {
            // 회원가입 실패 시 예외 메시지 반환
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));

        }
    }

    // 중복 체크 엔드포인트
    @GetMapping("/check")
    public ResponseEntity<?> checkDuplicate(
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String nickname) {
        try {
            if (id != null) {
                memberService.checkDuplicate("id", id);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "사용 가능한 ID입니다."
                ));
            } else if (email != null) {
                memberService.checkDuplicate("email", email);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "사용 가능한 이메일입니다."
                ));
            } else if (nickname != null) {
                memberService.checkDuplicate("nickname", nickname);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "사용 가능한 닉네임입니다."
                ));
            } else {
                throw new RuntimeException("유효하지 않은 요청입니다.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}
