package com.replace.domain.performance;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QPerformanceList is a Querydsl query type for PerformanceList
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPerformanceList extends EntityPathBase<PerformanceList> {

    private static final long serialVersionUID = -597163795L;

    public static final QPerformanceList performanceList = new QPerformanceList("performanceList");

    public final StringPath area = createString("area");

    public final StringPath endDate = createString("endDate");

    public final StringPath fname = createString("fname");

    public final StringPath genre = createString("genre");

    public final StringPath pid = createString("pid");

    public final StringPath pname = createString("pname");

    public final StringPath posterUrl = createString("posterUrl");

    public final StringPath startDate = createString("startDate");

    public QPerformanceList(String variable) {
        super(PerformanceList.class, forVariable(variable));
    }

    public QPerformanceList(Path<? extends PerformanceList> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPerformanceList(PathMetadata metadata) {
        super(PerformanceList.class, metadata);
    }

}

