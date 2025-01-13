package com.replace.repository.admin;

import com.replace.domain.member.Member;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AdminRepository extends JpaRepository<Member, String> {

    @EntityGraph(attributePaths = {"memberRoleList"})
    @Query("SELECT m FROM Member m")
    List<Member> getAllWithRoles();

    @EntityGraph(attributePaths = {"memberRoleList"})
    @Query("SELECT m FROM Member m WHERE m.nickname LIKE %:keyword% OR m.email LIKE %:keyword%")
    List<Member> searchByKeyword(@Param("keyword") String keyword);

    //1230
    @EntityGraph(attributePaths = {"memberRoleList"})
    List<Member> findByEmailIn(List<String> emails);


}
