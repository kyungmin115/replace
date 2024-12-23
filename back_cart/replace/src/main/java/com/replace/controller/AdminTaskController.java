package com.replace.controller;//package com.replace.controller;
//
//import com.replace.service.AdminTaskService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/admin")
//@RequiredArgsConstructor
//public class AdminTaskController {
//
//    private final AdminTaskService adminTaskService;
//
//    // 총 회원 수 조회
//    @GetMapping("/members/count")
//    public ResponseEntity<Long> getTotalMembers() {
//        long totalMembers = adminTaskService.getTotalMembers();
//        return ResponseEntity.ok(totalMembers);
//    }
//
//    // 특정 회원 삭제
//    @DeleteMapping("/members/{email}")
//    public ResponseEntity<String> deleteMember(@PathVariable String email) {
//        adminTaskService.deleteMemberByEmail(email);
//        return ResponseEntity.ok("Member deleted successfully.");
//    }
//
//    // 특정 게시물 삭제
//    @DeleteMapping("/posts/{postId}")
//    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
//        adminTaskService.deletePost(postId);
//        return ResponseEntity.ok("Post deleted successfully.");
//    }
//
//    // 특정 리뷰 삭제
//    @DeleteMapping("/reviews/{reviewId}")
//    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
//        adminTaskService.deleteReview(reviewId);
//        return ResponseEntity.ok("Review deleted successfully.");
//    }
//
//    // 관리자 작업 수행 (예: 회원 삭제, 게시물 삭제)
//    @PostMapping("/tasks/{taskId}/perform")
//    public ResponseEntity<String> performAdminTask(@PathVariable Long taskId) {
//        // 수행할 작업 로직
//        adminTaskService.performAdminTask(taskId);
//        return ResponseEntity.ok("Admin task performed successfully.");
//    }
//}
