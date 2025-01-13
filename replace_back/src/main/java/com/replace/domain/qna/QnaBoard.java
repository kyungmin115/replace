package com.replace.domain.qna;

import com.replace.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class QnaBoard extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long qno;

    @Column(length = 500, nullable = false) // 칼럼의 길이와 null 허용 여부
    private String title;

    @Column(length = 2000, nullable = false)
    private String content;

    @Column(length = 50, nullable = false)
    private String writer;

    @Builder.Default
    private boolean secret = false;

    @Builder.Default
    private boolean notice = false;

    @Enumerated(EnumType.STRING) // Enum 을 String 으로 저장
    @Builder.Default
    private QnaReplyStatus qnaReplyStatus = QnaReplyStatus.WAITING; // Status 기본 값은 WAITING 으로 설정

    public void change(String title, String content, Boolean notice, Boolean secret) {
        this.title = title;
        this.content = content;
        this.notice = notice;
        this.secret = secret;
    }

    public void updateQnaReplyStatus(QnaReplyStatus qnaReplyStatus) {
        this.qnaReplyStatus = qnaReplyStatus;
    }
}
