package com.replace.repository.goodsSearch;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.JPQLQuery;
import com.replace.domain.goods.Goods;
import com.replace.domain.goods.QGoods;
import com.replace.dto.goods.GoodsListDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;
import java.util.stream.Collectors;

public class GoodsSearchImpl extends QuerydslRepositorySupport implements GoodsSearch {

    public GoodsSearchImpl() {
        super(Goods.class);
    }

    @Override
    public Page<GoodsListDTO> searchGoods(String[] types, String keyword, Pageable pageable) {
        QGoods goods = QGoods.goods;
        JPQLQuery<Goods> query = from(goods);

        // 동적 쿼리 빌더
        if (types != null && types.length > 0 && keyword != null) {
            BooleanBuilder builder = new BooleanBuilder();

            // types 배열에 따라 조건 추가
            for (String type : types) {
                switch (type) {
                    case "g":
                        builder.or(goods.goodsName.contains(keyword));  // 상품 이름으로 검색
                        break;
                    case "s":
                        builder.or(goods.storeName.contains(keyword));  // 상점 이름으로 검색
                        break;
                    default:
                        break;
                }
            }
            query.where(builder);
        }

        // 기본 조건: goodsId가 0보다 큰 값만 조회
        query.where(goods.goodsId.gt(0L));

        // 페이지네이션 적용
        this.getQuerydsl().applyPagination(pageable, query);

        // 실제 결과를 조회
        List<Goods> goodsList = query.fetch();

        // DTO 변환
        List<GoodsListDTO> goodsListDTOList = goodsList.stream()
                .map(goods1 -> GoodsListDTO.builder()
                        .goodsId(goods1.getGoodsId())
                        .goodsImgUrl(goods1.getGoodsImgUrl())
                        .goodsName(goods1.getGoodsName())
                        .goodsPrice(goods1.getGoodsPrice())
                        .goodsStatus(goods1.getGoodsStatus())
                        .storeName(goods1.getStoreName())
                        .build())
                .collect(Collectors.toList());

        // 총 개수 조회
        long count = query.fetchCount();

        // PageImpl로 반환
        return new PageImpl<>(goodsListDTOList, pageable, count);
    }
}
