package com.replace.repository.qnaSearch;


import com.replace.domain.qna.QnaBoard;
import com.replace.dto.qna.QnaBoardListAllDTO;
import com.replace.dto.qna.QnaBoardReplyCountDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QnaBoardSearch {

    Page<QnaBoard> search1(Pageable pageable);
    // types(제목(t), 내용(c), 작성자(w) 로 구성되어 있다)는 여러 조건의 조합이 가능하도록
    Page<QnaBoard> searAll(String[] types, String keyword, Pageable pageable);

    // 검색종류 ('types'), 검색 키워드, 페이지 정보 등을 받고 댓글수를 포함한 게시글 정보를 받겠다.
    Page<QnaBoardReplyCountDTO> searchWithReplyCount(String[] types, String keyword, Pageable pageable);

    // 검색종류 ('types'), 검색 키워드, 페이지 정보 등을 받고 댓글수, 이미지를 포함한 게시글 정보를 받겠다.
    Page<QnaBoardListAllDTO> searchWithAll(String[] types, String keyword, Pageable pageable);
}
