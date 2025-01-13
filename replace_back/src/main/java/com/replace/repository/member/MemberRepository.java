package com.replace.repository.member;

import com.replace.domain.member.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface MemberRepository extends JpaRepository<Member, String> {


    // attributePaths 로 즉시로딩 처리를 진행할수 있다.
    @EntityGraph(attributePaths = {"memberRoleList"})
    @Query("SELECT m FROM Member m LEFT JOIN FETCH m.memberRoleList WHERE m.id = :id")
    Member getWithRoles(@Param("id") String id); // m_id를 기준으로 조회


//    @EntityGraph(attributePaths = {"memberRoleList"})
//    @Query("SELECT m FROM Member m WHERE m.id = :id")
//    Member getWithRoles(@Param("id") String id);


    boolean existsById(String id);
    // ID 중복 확인
    boolean existsByNickname(String nickname); // 닉네임 중복 확인

    boolean existsByEmail(String email);// 이메일 중복 여부 확인


}






