package com.replace.controller.member;

import com.replace.dto.member.MemberDTO;
import com.replace.dto.member.MemberModifyDTO;
import com.replace.service.member.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Log4j2
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberDTO memberDTO) {
        try {
            // 로그인 처리
            MemberDTO loggedInMember = memberService.login(memberDTO.getId(), memberDTO.getPw());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "로그인 성공",
                    "data", loggedInMember
            ));
        } catch (RuntimeException e) {
            // 입력 오류 처리
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "success", false,
                    "message", "아이디 또는 비밀번호가 잘못되었습니다."
            ));
        } catch (Exception e) {
            // 서버 내부 오류 처리
            log.error("로그인 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
            ));
        }
    }




//1231
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody MemberDTO memberDTO) {
//        try {
//            // 로그인 처리
//            MemberDTO loggedInMember = memberService.login(memberDTO.getId(), memberDTO.getPw());
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "message", "로그인 성공",
//                    "data", loggedInMember
//            ));
//        } catch (UsernameNotFoundException e) {
//            // 아이디 또는 비밀번호가 잘못된 경우
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
//                    "success", false,
//                    "message", "아이디 또는 비밀번호가 잘못되었습니다."
//            ));
//        } catch (RuntimeException e) {
//            // 예상치 못한 런타임 에러
//            log.error("로그인 중 오류 발생: {}", e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
//                    "success", false,
//                    "message", "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
//            ));
//        }
//    }

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody MemberDTO memberDTO) {
//        try {
//            MemberDTO loggedInMember = memberService.login(memberDTO.getId(), memberDTO.getPw());
//            return ResponseEntity.ok(loggedInMember);
//        } catch (UsernameNotFoundException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
//                    "success", false,
//                    "message", "아이디 또는 비밀번호가 잘못되었습니다."
//            ));
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
//                    "success", false,
//                    "message", "알 수 없는 오류가 발생했습니다."
//            ));
//        }
//    }
//1231 수정 전 안정코드
//    @PostMapping("/login")//로그인
//    public ResponseEntity<?> login(@RequestBody MemberDTO memberDTO) {
//        try {
//            MemberDTO loggedInMember = memberService.login(memberDTO.getId(), memberDTO.getPw());
//            return ResponseEntity.ok(loggedInMember);
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
//        }
//    }


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
    // 현재 사용자 정보 조회 0103

    @GetMapping("/me")
    public ResponseEntity<?> getMemberInfo() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
                throw new RuntimeException("사용자가 인증되지 않았습니다.");
            }

            String currentUserId = authentication.getName();
            log.info("현재 로그인된 사용자 ID: " + currentUserId);

            MemberDTO memberDTO = memberService.getMemberById(currentUserId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "사용자 정보 조회 성공",
                    "data", memberDTO
            ));
        } catch (RuntimeException e) {
            log.error("사용자 정보 조회 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }


    @PutMapping("/me")  //0103 MyPage 회원정보 수정
    public ResponseEntity<?> updateMemberInfo(@RequestBody MemberModifyDTO modifyDTO) {
        try {
            // 현재 로그인한 사용자의 ID를 가져옵니다
            String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
            modifyDTO.setId(currentUserId); // 현재 사용자 ID를 DTO에 설정
            memberService.modifyMember(modifyDTO);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "회원 정보가 수정되었습니다."
            ));
        } catch (RuntimeException e) {
            log.error("회원 정보 수정 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
    //    @DeleteMapping("/me")
//    public ResponseEntity<?> deleteMember() {
//        try {
//            // 현재 로그인한 사용자의 ID를 가져옵니다.
//            String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//            memberService.deleteMember(currentUserId);
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "message", "회원 탈퇴가 완료되었습니다."
//            ));
//        } catch (RuntimeException e) {
//            log.error("회원 탈퇴 오류: {}", e.getMessage());
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
//                    "success", false,
//                    "message", e.getMessage()
//            ));
//        }
//    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteMember() {
        try {
            // 현재 로그인한 사용자의 ID를 가져옵니다.
            String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
            memberService.deleteMember(currentUserId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "회원 탈퇴가 완료되었습니다."
            ));
        } catch (RuntimeException e) {
            log.error("회원 탈퇴 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}
