package com.replace.dto.qna;

import com.replace.domain.qna.QnaReplyStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QnaBoardDTO {

    private Long qno;

    @NotEmpty(message = "Title is required")
    @Size(min = 3, max = 100)
    private String title;

    @NotEmpty(message = "Title is required")
    private String content;

    private String writer;

    private boolean secret;

    private boolean notice;

    private QnaReplyStatus qnaReplyStatus; // 상태 추가

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
