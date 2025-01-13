package com.replace.repository.goodsSearch;

import com.replace.dto.goods.GoodsListDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GoodsSearch {
    Page<GoodsListDTO> searchGoods(String[] types, String keyword, Pageable pageable);
}
