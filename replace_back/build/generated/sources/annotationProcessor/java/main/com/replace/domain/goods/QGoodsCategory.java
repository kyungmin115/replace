package com.replace.domain.goods;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QGoodsCategory is a Querydsl query type for GoodsCategory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QGoodsCategory extends EntityPathBase<GoodsCategory> {

    private static final long serialVersionUID = -1172127591L;

    public static final QGoodsCategory goodsCategory = new QGoodsCategory("goodsCategory");

    public final NumberPath<Long> goodsCategoryId = createNumber("goodsCategoryId", Long.class);

    public final StringPath goodsCategoryName = createString("goodsCategoryName");

    public QGoodsCategory(String variable) {
        super(GoodsCategory.class, forVariable(variable));
    }

    public QGoodsCategory(Path<? extends GoodsCategory> path) {
        super(path.getType(), path.getMetadata());
    }

    public QGoodsCategory(PathMetadata metadata) {
        super(GoodsCategory.class, metadata);
    }

}

