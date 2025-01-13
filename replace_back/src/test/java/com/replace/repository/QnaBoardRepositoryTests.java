package com.replace.repository;

import com.replace.domain.qna.QnaBoard;
import com.replace.repository.qna.QnaBoardRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.stream.IntStream;

@SpringBootTest
@Log4j2
public class QnaBoardRepositoryTests {

    @Autowired
    private QnaBoardRepository qnaBoardRepository;

    @Test
    public void testInsert(){
        IntStream.rangeClosed(1, 100).forEach((i -> {
            QnaBoard qnaBoard = QnaBoard.builder()
                    .title("문의드립니다"+i)
                    .content("내용"+i)
                    .writer("user"+(i % 10))
                    .build();

            // JpaRepository 에 save(insert)라는 메소드가 있다.
            QnaBoard result = qnaBoardRepository.save(qnaBoard);
            log.info("QNO: " + result.getQno());
        }));
    }
}
