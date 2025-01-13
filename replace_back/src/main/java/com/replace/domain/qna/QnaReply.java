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
@Table(name = "qnaReply")
//indexes = {@Index(name = "idx_qnaReply_qnaBoard_qno", columnList = "qnaBoard_qno")}
public class QnaReply extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long qrno;

    // Many는 Reply, One은 Board를 뜻함. 많은 Reply 객체들이 하나의 Board 객체에 연결될 수 있다.
    // LAZY는 엔티티의 로딩을 지연, Reply 엔티티만 데이터베이스에서 가져올 때 연관된 Board의 텐티티는 로딩되지 않는다.
    // FetchType.EAGER 즉시 로딩하면 리플 가져올 때마다 Board도 같이 가져온다.
    @ManyToOne(fetch = FetchType.LAZY)
    private QnaBoard qnaBoard;

    private String replyText;

    private String replyer;

    // replyText를 수정하기 위한 함수
    public void changeText(String text){
        this.replyText = text;
    }
}
