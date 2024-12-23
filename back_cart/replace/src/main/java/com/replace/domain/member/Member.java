package com.replace.domain.member;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class Member {

    @Id
    @Column(name="m_id",nullable = false, unique = true)
    private String id; // 사용자 고유 ID (PK)

    @Column(name = "m_pw",nullable = false)
    private String pw; // 사용자 비밀번호

    @Column(name="m_email", nullable = false, unique = true)
    private String email; // 사용자 이메일

    @Column(name = "m_phone")
    private String phone; // 사용자 전화번호

    @Column(name = "m_nick_name")
    private String nickname; // 닉네임

    @Column(name = "m_gender")
    private String gender; // 성별 (M/F)

    @Column(name = "m_birth_date")
    private LocalDate birthDate; // 생년월일

    @Column(name="m_address")
    private  String address; //주소

    @Builder.Default
    @Column(name = "m_deleted")
    private boolean deleted = false; // 탈퇴 여부 (기본값 false)

    @Builder.Default
    @Column(name = "m_social")
    private boolean social = false; // 소셜 로그인 여부 (기본값 false)

    @Column(name="m_created_at",nullable = false, updatable = false)
    private LocalDateTime createdAt; // 계정 생성일

    @Column(name="m_updated_at",nullable = false)
    private LocalDateTime updatedAt; // 계정 수정일

    @ElementCollection(fetch = FetchType.LAZY) // 역할 리스트를 별도 테이블에 저장
    @CollectionTable(name = "member_role", joinColumns = @JoinColumn(name = "m_id")) // 테이블 매핑
    @Column(name = "role_name") // 역할 이름 컬럼
    @Builder.Default
    private List<MemberRole> memberRoleList = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 비밀번호 변경 메서드
    public void changePw(String pw) {
        this.pw = pw;
    }

    // 닉네임 변경 메서드
    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    // 탈퇴 여부 변경 메서드
    public void changeDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    // 소셜 로그인 여부 변경 메서드
    public void changeSocial(boolean social) {
        this.social = social;
    }

    // 역할 추가 메서드
    public void addRole(MemberRole memberRole) {
        if (!memberRoleList.contains(memberRole)) {
            memberRoleList.add(memberRole);
        }
    }

    // 역할 초기화 메서드 (모든 역할 제거)
    public void clearRoles() {
        memberRoleList.clear();
    }
}
