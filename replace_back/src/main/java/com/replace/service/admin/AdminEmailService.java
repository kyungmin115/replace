package com.replace.service.admin;

import java.util.List;

//관리자 전용 이메일 발송

public interface AdminEmailService {

    void sendEmails(List<String> toAddresses, String subject, String body);
}
