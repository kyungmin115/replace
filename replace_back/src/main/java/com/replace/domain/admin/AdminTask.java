//package com.replace.domain;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Entity
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//@Getter
//@ToString(exclude = "adminRoleList")
//public class AdminTask {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String taskName;  // 작업 이름 (예: "회원 조회", "게시물 삭제" 등)
//    private String description;  // 작업 설명
//
//    @ElementCollection(fetch = FetchType.LAZY)
//    @Builder.Default
//    private List<MemberRole> adminRoleList = new ArrayList<>(); // 관리자가 수행하는 역할 목록
//
//    // 관리자 역할 추가
//    public void addRole(MemberRole role) {
//        adminRoleList.add(role);
//    }
//
//    // 역할 리스트 초기화
//    public void clearRoles() {
//        adminRoleList.clear();
//    }
//}
