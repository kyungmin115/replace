package com.replace.service.qna;

import com.replace.domain.qna.QnaBoard;
import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;
import com.replace.dto.qna.QnaBoardDTO;
import com.replace.dto.qna.QnaBoardListAllDTO;
import com.replace.dto.qna.QnaBoardReplyCountDTO;

public interface QnaBoardService {

    Long register(QnaBoardDTO qnaBoardDTO);

    QnaBoardDTO readOne(Long qno);

    void modify(QnaBoardDTO qnaBoardDTO);

    void remove(Long qno);

    PageResponseDTO<QnaBoardDTO> list(PageRequestDTO pageRequestDTO);

    // 댓글의 숫자까지 처리
    PageResponseDTO<QnaBoardReplyCountDTO> listWithReplyCount(PageRequestDTO pageRequestDTO);

    // 게시글의 댓글의 숫자까지 처리
    PageResponseDTO<QnaBoardListAllDTO> listWithAll(PageRequestDTO pageRequestDTO);

    // BoardService 인터페이스가 DTO와 entity를 모두 처리하는 경우가 많다.
    // BpardServoce를 구현하는 모든 클래스에서 공통적으로 사용되는 메서드로 default를 사용하여
    // 기본 적으로 무조건 구현하게 하는 메서드.
    // file 처리와 함께 boardDTO->board
    default QnaBoard dtoToEntity(QnaBoardDTO qnaBoardDTO){

        QnaBoard qnaBoard = QnaBoard.builder()
                .qno(qnaBoardDTO.getQno())
                .title(qnaBoardDTO.getTitle())
                .content(qnaBoardDTO.getContent())
                .writer(qnaBoardDTO.getWriter())
                .notice(qnaBoardDTO.isNotice())
                .secret(qnaBoardDTO.isSecret())
                .build();

        return qnaBoard;
    }

    // qnaBoard -> qnaBoardDTO
    default QnaBoardDTO entityToDTO(QnaBoard qnaBoard){

        QnaBoardDTO qnaBoardDTO = QnaBoardDTO.builder()
                .qno(qnaBoard.getQno())
                .title(qnaBoard.getTitle())
                .content(qnaBoard.getContent())
                .writer(qnaBoard.getWriter())
                .notice(qnaBoard.isNotice())
                .secret(qnaBoard.isSecret())
                .createdAt(qnaBoard.getCreatedAt())
                .updatedAt(qnaBoard.getUpdatedAt())
                .build();

        return qnaBoardDTO;
    }
}
