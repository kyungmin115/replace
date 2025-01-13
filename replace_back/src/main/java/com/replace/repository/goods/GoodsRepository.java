package com.replace.repository.goods;

import com.replace.domain.goods.Goods;
import com.replace.domain.goods.GoodsStatus;
import com.replace.repository.goodsSearch.GoodsSearch;
import org.hibernate.annotations.BatchSize;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GoodsRepository extends JpaRepository<Goods, Long>, GoodsSearch {

    // 굿즈 ID로 찾을 때 goodsCategory
    @EntityGraph(attributePaths = "goodsCategory")
    Optional<Goods> findById(Long goodsId);

    @EntityGraph(attributePaths = "goodsCategory")
    Optional<Goods> findFirstByGoodsNameContaining(String goodsName);

    // 카테고리 ID로 상품 조회 (상태 필터링 없음)
    @BatchSize(size = 30)
    @Query("SELECT g FROM Goods g WHERE g.goodsCategory.goodsCategoryId = :categoryId")
    Page<Goods> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    // 굿즈 상태가 주어졌을 때 필터링 (모든 상태의 굿즈 조회)
    @Query("SELECT g FROM Goods g WHERE g.goodsStatus = :goodsStatus")
    Page<Goods> findByGoodsStatus(@Param("goodsStatus") GoodsStatus goodsStatus, Pageable pageable);

    // 카테고리 ID와 상태가 모두 주어졌을 때 필터링 (카테고리와 상태로 필터링)
    @BatchSize(size = 30)
    @Query("SELECT g FROM Goods g WHERE g.goodsCategory.goodsCategoryId = :categoryId AND g.goodsStatus = :goodsStatus")
    Page<Goods> findByCategoryIdAndGoodsStatus(@Param("categoryId") Long categoryId, @Param("goodsStatus") GoodsStatus goodsStatus, Pageable pageable);

}

