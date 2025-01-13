package com.replace.dto.qna;

import com.replace.dto.PageResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QnaBoardListAllDTO { // qnaBoard 와 qnaReply 처리 모두 가능한 DTO

    private QnaBoardDTO board; // 게시글 상세 정보
    private PageResponseDTO<QnaReplyDTO> replies; // 댓글 목록

    private Long qno;

    private String title;

    private String content;

    private String writer;

    private boolean notice;

    private boolean secret;

    private LocalDateTime createdAt;

    private Long qnaReplyCount;
}
