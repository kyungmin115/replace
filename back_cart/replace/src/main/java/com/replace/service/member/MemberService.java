package com.replace.service.member;


import com.replace.dto.MemberModifyDTO;
import org.springframework.transaction.annotation.Transactional;
import com.replace.dto.member.MemberDTO;



@Transactional
public interface MemberService {

    MemberDTO login(String id, String password);


    MemberDTO getKakaoMember(String accessToken);

    void modifyMember(MemberModifyDTO memberModifyDTO);

    // 새로 추가된 회원가입 메서드
    void registerMember(MemberDTO memberDTO);


    //중복 체크 메서드
    void checkDuplicate(String type, String value);




}