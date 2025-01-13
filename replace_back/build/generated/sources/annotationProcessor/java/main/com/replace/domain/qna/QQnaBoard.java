package com.replace.domain.qna;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QQnaBoard is a Querydsl query type for QnaBoard
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QQnaBoard extends EntityPathBase<QnaBoard> {

    private static final long serialVersionUID = 1520294927L;

    public static final QQnaBoard qnaBoard = new QQnaBoard("qnaBoard");

    public final com.replace.domain.QBaseEntity _super = new com.replace.domain.QBaseEntity(this);

    public final StringPath content = createString("content");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final BooleanPath notice = createBoolean("notice");

    public final EnumPath<QnaReplyStatus> qnaReplyStatus = createEnum("qnaReplyStatus", QnaReplyStatus.class);

    public final NumberPath<Long> qno = createNumber("qno", Long.class);

    public final BooleanPath secret = createBoolean("secret");

    public final StringPath title = createString("title");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final StringPath writer = createString("writer");

    public QQnaBoard(String variable) {
        super(QnaBoard.class, forVariable(variable));
    }

    public QQnaBoard(Path<? extends QnaBoard> path) {
        super(path.getType(), path.getMetadata());
    }

    public QQnaBoard(PathMetadata metadata) {
        super(QnaBoard.class, metadata);
    }

}

