package com.replace.repository.wishList;

import com.replace.domain.member.Member;
import com.replace.domain.performance.PerformanceList;
import com.replace.domain.wishList.WishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishListRepository extends JpaRepository<WishList, Long> {

    boolean existsByMemberAndPerformanceList(Member member, PerformanceList performanceList);

    boolean existsByMember_IdAndPerformanceList_Pid(String memberId, String pid);

    List<WishList> findAllByMemberId(String memberId);

    void deleteByMemberAndPerformanceList(Member member, PerformanceList performanceList);
}
