package com.replace.service.goods;

import com.replace.domain.goods.GoodsCategory;
import com.replace.domain.goods.GoodsStatus;
import com.replace.dto.goods.GoodsDetailDTO;
import com.replace.dto.goods.GoodsListDTO;
import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface GoodsService {
    GoodsDetailDTO getGoods(Long goodsId);
    // 카테고리, 상태, 정렬 기준 등을 기반으로 굿즈 목록을 가져오는 메서드
    PageResponseDTO<GoodsListDTO> getGoodsPage(PageRequestDTO pageRequestDTO, Long categoryId, GoodsStatus goodsStatus, Sort sort);

    void setRandomViewCountForAllGoods();

    void incrementViewCount(Long goodsId);

    PageResponseDTO<GoodsListDTO> searchGoodsList(PageRequestDTO pageRequestDTO);

    Long getGoodsIdByGoodsName(String name);

    List<GoodsCategory> getAllCategories();
}
