package com.replace.service.admin;

import com.replace.dto.admin.AdminMemberDTO;
import com.replace.repository.admin.AdminRepository; // 변경된 Repository import

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository; // MemberRepository → AdminRepository

    @Override
    public List<AdminMemberDTO> getAllMembers() {
        return adminRepository.getAllWithRoles().stream()
                .map(AdminMemberDTO::fromEntity) // Member → AdminMemberDTO 변환
                .collect(Collectors.toList());
    }

    @Override
    public void deleteMember(String id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("회원이 존재하지 않습니다.");
        }
        adminRepository.deleteById(id);
    }
    @Override
    public List<AdminMemberDTO> searchMembers(String keyword) {
        return adminRepository.searchByKeyword(keyword).stream()
                .map(AdminMemberDTO::fromEntity) // Member → AdminMemberDTO 변환
                .collect(Collectors.toList());
    }


    @Override//1229 이메일
    public List<AdminMemberDTO> getMembersByEmails(List<String> emails) {
        return adminRepository.findByEmailIn(emails)
                .stream()
                .map(AdminMemberDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
