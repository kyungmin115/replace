package com.replace.domain.qna;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QQnaReply is a Querydsl query type for QnaReply
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QQnaReply extends EntityPathBase<QnaReply> {

    private static final long serialVersionUID = 1534787603L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QQnaReply qnaReply = new QQnaReply("qnaReply");

    public final com.replace.domain.QBaseEntity _super = new com.replace.domain.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final QQnaBoard qnaBoard;

    public final NumberPath<Long> qrno = createNumber("qrno", Long.class);

    public final StringPath replyer = createString("replyer");

    public final StringPath replyText = createString("replyText");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QQnaReply(String variable) {
        this(QnaReply.class, forVariable(variable), INITS);
    }

    public QQnaReply(Path<? extends QnaReply> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QQnaReply(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QQnaReply(PathMetadata metadata, PathInits inits) {
        this(QnaReply.class, metadata, inits);
    }

    public QQnaReply(Class<? extends QnaReply> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.qnaBoard = inits.isInitialized("qnaBoard") ? new QQnaBoard(forProperty("qnaBoard")) : null;
    }

}

