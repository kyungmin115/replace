package com.replace.controller.goods;

import com.replace.dto.goods.GoodsDetailDTO;
import com.replace.dto.goods.GoodsListDTO;
import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;
import com.replace.service.goods.GoodsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/goods")
@RequiredArgsConstructor
@Log4j2
public class GoodsController {

    private final GoodsService goodsService;

    // 상품 목록 조회
    @GetMapping("/list")
    public PageResponseDTO<GoodsListDTO> list(PageRequestDTO pageRequestDTO) {
        log.info("list: " + pageRequestDTO);
        return goodsService.getGoodsPage(pageRequestDTO);
    }

    // 카테고리별로 굿즈 목록을 페이지네이션 처리하여 반환
    @GetMapping("/category/{categoryId}")
    public PageResponseDTO<GoodsListDTO> getGoodsByCategory(
            PageRequestDTO pageRequestDTO,
            @PathVariable Long categoryId) {

        return goodsService.getGoodsByCategory(pageRequestDTO, categoryId);
    }

    // 특정 상품 조회
    @GetMapping("/{goodsId}")
    public GoodsDetailDTO read(@PathVariable(name = "goodsId") Long goodsId) {
        return goodsService.getGoods(goodsId);
    }

}


