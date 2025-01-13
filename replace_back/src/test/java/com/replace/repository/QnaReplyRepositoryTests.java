package com.replace.repository;

import com.replace.domain.qna.QnaBoard;
import com.replace.domain.qna.QnaReply;
import com.replace.repository.qna.QnaReplyRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Log4j2
public class QnaReplyRepositoryTests {

    @Autowired
    private QnaReplyRepository qnaReplyRepository;

    @Test
    public void testInsert(){

        // 실제 DB에 있는 bno
        Long qno = 100L;

        QnaBoard qnaBoard = QnaBoard.builder()
                .qno(qno)
                .build();

        QnaReply qnaReply = QnaReply.builder()
                .qnaBoard(qnaBoard)
                .replyText("프로젝트 제발")
                .replyer("replyer04")
                .build();

        qnaReplyRepository.save(qnaReply);
    }
}
