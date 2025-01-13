package com.replace.service.wishList;

import com.replace.domain.member.Member;
import com.replace.domain.performance.PerformanceList;
import com.replace.dto.wishList.WishListResponseDTO;
import com.replace.repository.member.MemberRepository;
import com.replace.repository.performance.PerformanceListRepository;
import com.replace.repository.wishList.WishListRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Transactional
@Service
public class WishListService {
    private final MemberRepository memberRepository;
    private final PerformanceListRepository performanceListRepository;
    private final WishListRepository wishListRepository;

    //찜 추가
    public void addToWishList(String memberId, String pid) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 없습니다."));

        PerformanceList performanceList = performanceListRepository.findById(pid)
                .orElseThrow(() -> new IllegalArgumentException("공연이 없습니다."));

        //이미 찜한 공연 확인
        if(wishListRepository.existsByMemberAndPerformanceList(member, performanceList)) {
            throw new IllegalStateException("이미 찜목록에 있는 항목입니다.");
        }

        member.addToWishList(performanceList);
        memberRepository.save(member);
    }

    //찜 제거
    public void removeFromWishList(String memberId, String pid) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 없습니다."));

        PerformanceList performanceList = performanceListRepository.findById(pid)
                .orElseThrow(() -> new IllegalArgumentException("공연을 찾을 수 없습니다."));

        member.removeFromWishList(performanceList);
        memberRepository.save(member);
    }

    //찜 목록 조회
    public List<WishListResponseDTO> getWishList(String memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return member.getWishList().stream()
                .map(wishList -> WishListResponseDTO.builder()
                        .performanceId(wishList.getPerformanceList().getPid())
                        .performanceName(wishList.getPerformanceList().getPname())
                        .posterUrl(wishList.getPerformanceList().getPosterUrl())
                        .genre(wishList.getPerformanceList().getGenre())
                        .startDate(String.valueOf(wishList.getPerformanceList().getStartDate()))
                        .endDate(String.valueOf(wishList.getPerformanceList().getEndDate()))
                        .createdAt(wishList.getCreatedAt().atStartOfDay())
                        .build())
                .collect(Collectors.toList());
    }

    //찜 여부 확인
    public boolean isInWishList(String memberId, String performanceId) {
        return wishListRepository.existsByMember_IdAndPerformanceList_Pid(memberId, performanceId);
    }
}
