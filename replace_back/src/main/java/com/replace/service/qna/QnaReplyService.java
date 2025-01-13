package com.replace.service.qna;

import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;
import com.replace.dto.qna.QnaReplyDTO;


public interface QnaReplyService {

    Long register(QnaReplyDTO qnaReplyDTO);
    QnaReplyDTO read(Long qrno);

    void modify(QnaReplyDTO qnaReplyDTO);

    void remove(Long qrno);

    // 특정 게시물의 댓글 목록을 페이징 처리해서 조회
    PageResponseDTO<QnaReplyDTO> getListOfBoard(Long qno, PageRequestDTO pageRequestDTO);
}
