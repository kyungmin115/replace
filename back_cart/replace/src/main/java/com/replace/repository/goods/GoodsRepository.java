package com.replace.repository.goods;

import com.replace.domain.goods.Goods;
import org.hibernate.annotations.BatchSize;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GoodsRepository extends JpaRepository<Goods, Long> {

    // 굿즈 ID로 찾을 때 goodsCategory와 goodsDetailImageList를 함께 로딩
    @EntityGraph(attributePaths = "goodsCategory")
    Optional<Goods> findById(Long goodsId);

    @BatchSize(size = 50)
    @Query("SELECT g FROM Goods g WHERE g.goodsCategory.goodsCategoryId = :categoryId")
    Page<Goods> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);


}
