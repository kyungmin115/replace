package com.replace.controller.admin;

import com.replace.dto.admin.AdminMemberDTO;
import com.replace.dto.admin.EmailRequestDTO;
import com.replace.service.admin.AdminService;
import com.replace.service.admin.AdminEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService; // 회원 관리 서비스
    private final AdminEmailService adminEmailService; // 이메일 발송 서비스

    // 전체 회원 조회
    @GetMapping("/members")
    public ResponseEntity<List<AdminMemberDTO>> getAllMembers() {
        return ResponseEntity.ok(adminService.getAllMembers());
    }

    // 회원 검색
    @GetMapping("/members/search")
    public ResponseEntity<List<AdminMemberDTO>> searchMembers(@RequestParam String keyword) {
        return ResponseEntity.ok(adminService.searchMembers(keyword));
    }

    // 회원 삭제
    @DeleteMapping("/members/{id}")
    public ResponseEntity<String> deleteMember(@PathVariable String id) {
        adminService.deleteMember(id);
        return ResponseEntity.ok("회원이 삭제되었습니다.");
    }


    // 이메일 수신 동의 회원에게 이메일 발송
    @PostMapping("/members/send-email")
    public ResponseEntity<String> sendEmails(@RequestBody EmailRequestDTO request) {
        //  DTO에서 값 추출
        List<String> memberEmails = request.getMemberEmails(); // 이메일 주소 리스트
        String subject = request.getSubject();                 // 이메일 제목
        String body    = request.getBody();                   // 이메일 본문

        //  이메일 리스트로 회원 정보 조회 & 수신 동의 여부 필터
        List<AdminMemberDTO> agreeMembers = adminService.getMembersByEmails(memberEmails)
                .stream()
                .filter(AdminMemberDTO::isAgreeEmail) // 이메일 수신 동의 여부 필터링
                .toList();

        if (agreeMembers.isEmpty()) {
            return ResponseEntity.badRequest().body("이메일 수신 동의한 회원이 없습니다.");
        }

        //  이메일 주소 리스트 추출
        List<String> addresses = agreeMembers.stream()
                .map(AdminMemberDTO::getEmail)
                .toList();

        //  이메일 발송 (사용자가 넘긴 subject, body 그대로 사용)
        adminEmailService.sendEmails(addresses, subject, body);

        return ResponseEntity.ok("이벤트 이메일 발송 성공!");
    }
}






//    // 이메일 수신 동의 회원에게 이메일 발송
//    @PostMapping("/members/send-email")
//    public ResponseEntity<String> sendEmails(@RequestBody EmailRequestDTO request) {
//        // DTO에서 값 추출
//        List<String> memberEmails = request.getMemberEmails(); // 이메일 주소 리스트
//        String subject = request.getSubject();                // 이메일 제목
//        String body = request.getBody();                      // 이메일 본문
//
//
//
//        // 이메일 리스트로 회원 정보 조회
//        List<AdminMemberDTO> agreeMembers = adminService.getMembersByEmails(memberEmails)
//                .stream()
//                .filter(AdminMemberDTO::isAgreeEmail) // 이메일 수신 동의 여부 필터링
//                .toList();
//
//        if (agreeMembers.isEmpty()) {
//            return ResponseEntity.badRequest().body("이메일 수신 동의한 회원이 없습니다.");
//        }


