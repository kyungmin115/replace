package com.replace.domain.performance;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPerformanceDetail is a Querydsl query type for PerformanceDetail
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPerformanceDetail extends EntityPathBase<PerformanceDetail> {

    private static final long serialVersionUID = 1418498272L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPerformanceDetail performanceDetail = new QPerformanceDetail("performanceDetail");

    public final StringPath cast = createString("cast");

    public final StringPath director = createString("director");

    public final StringPath endDate = createString("endDate");

    public final QFacility facility;

    public final StringPath fid = createString("fid");

    public final StringPath fname = createString("fname");

    public final StringPath genre = createString("genre");

    public final StringPath pid = createString("pid");

    public final StringPath pname = createString("pname");

    public final StringPath posterUrls = createString("posterUrls");

    public final StringPath price = createString("price");

    public final StringPath ptime = createString("ptime");

    public final StringPath runtime = createString("runtime");

    public final StringPath startDate = createString("startDate");

    public QPerformanceDetail(String variable) {
        this(PerformanceDetail.class, forVariable(variable), INITS);
    }

    public QPerformanceDetail(Path<? extends PerformanceDetail> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPerformanceDetail(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPerformanceDetail(PathMetadata metadata, PathInits inits) {
        this(PerformanceDetail.class, metadata, inits);
    }

    public QPerformanceDetail(Class<? extends PerformanceDetail> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.facility = inits.isInitialized("facility") ? new QFacility(forProperty("facility")) : null;
    }

}

