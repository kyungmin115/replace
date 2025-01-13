package com.replace.repository.qna;

import com.replace.domain.qna.QnaBoard;
import com.replace.repository.qnaSearch.QnaBoardSearch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QnaBoardRepository extends JpaRepository<QnaBoard, Long>, QnaBoardSearch {
}
