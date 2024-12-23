package com.replace.service.goods;

import com.replace.dto.goods.GoodsDetailDTO;
import com.replace.dto.goods.GoodsListDTO;
import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;

public interface GoodsService {
    GoodsDetailDTO getGoods(Long goodsId);
    PageResponseDTO<GoodsListDTO> getGoodsPage(PageRequestDTO pageRequestDTO);
    PageResponseDTO<GoodsListDTO> getGoodsByCategory(PageRequestDTO pageRequestDTO, Long categoryId);
}
