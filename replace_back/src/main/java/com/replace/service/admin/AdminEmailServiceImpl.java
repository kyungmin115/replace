package com.replace.service.admin;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;


import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class AdminEmailServiceImpl implements AdminEmailService {

    private final JavaMailSender mailSender; // Spring의 메일 전송 도구

    @Override
    public void sendEmails(List<String> toAddresses, String subject, String body) {
        for (String to : toAddresses) {
            try {
                sendEmail(to, subject, body);
                log.info("이메일 발송 성공: {}", to);
            } catch (Exception e) {
                log.error("이메일 발송 실패: {}, 에러: {}", to, e.getMessage());
            }
        }
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);                              // 수신자 이메일 주소
        message.setSubject(subject);                   // 이메일 제목
        message.setText(body);                         // 이메일 본문
        message.setFrom("pisa990705@gmail.com");       // 발신자 이메일 주소

        mailSender.send(message); // 이메일 발송 실행
    }
}
