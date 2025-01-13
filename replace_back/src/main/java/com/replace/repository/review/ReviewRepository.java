package com.replace.repository.review;

import com.replace.domain.goods.Goods;
import com.replace.domain.review.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    void deleteByGoods_goodsId(Long goodsId);

    @EntityGraph(attributePaths = "imageList")
    @Query("select re from Review re where re.rid = :rid")
    Optional<Review> selectOne(@Param("rid") Long rid);

    @Modifying
    @Query("update Review re set re.delReviewFlag = :flag where re.rid = :rid")
    void updateToDelete(@Param("rid") Long rid, @Param("flag") Boolean flag);

    @Query("select re, ri " +
            "from Review re " +
            "left join re.imageList ri " +
            "where ri.ord = 0 and re.delReviewFlag = false and re.goods.goodsId = :goodsId")
    Page<Object[]> selectList(@Param("goodsId") Long goodsId,Pageable pageable);

    @Query("select re from Review re where re.goods.goodsId = :goodsId and re.delReviewFlag = false")
    Page<Review> listOfBoard(@Param("goodsId") Long goodsId, Pageable pageable);

    // 전체 평균 평점 계산
    @Query("SELECT AVG(re.rating) FROM Review re WHERE re.goods.goodsId = :goodsId and re.delReviewFlag = false")
    Double calculateAvgRatingByGoodsId(@Param("goodsId") Long goodsId);

    // 특정 게시글의 댓글 수를 카운트
    long countByGoods(Goods goods);
}

