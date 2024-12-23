package com.replace.service.goods;

import com.replace.domain.goods.Goods;
import com.replace.dto.goods.GoodsDetailDTO;
import com.replace.dto.goods.GoodsListDTO;
import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;
import com.replace.repository.goods.GoodsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@RequiredArgsConstructor
@Log4j2
@Service
public class GoodsServiceImpl implements GoodsService {

    private final GoodsRepository goodsRepository;

    @Override
    public GoodsDetailDTO getGoods(Long goodsId) {
        log.info("-------getGoods-------");

        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new RuntimeException("Goods not found"));

        return mapToDTO(goods);
    }

    @Override
    public PageResponseDTO<GoodsListDTO> getGoodsPage(PageRequestDTO pageRequestDTO) {
        log.info("-------searchGoods-------");

        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("goodsId").descending());

        Page<Goods> result = goodsRepository.findAll(pageable);

        List<GoodsListDTO> dtoList = result.getContent().stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        PageResponseDTO<GoodsListDTO> responseDTO = PageResponseDTO.<GoodsListDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

        return responseDTO;
    }

    @Override
    public PageResponseDTO<GoodsListDTO> getGoodsByCategory(PageRequestDTO pageRequestDTO, Long categoryId) {
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                Sort.by("goodsId").descending());

        // 카테고리별로 페이지네이션 처리된 굿즈 목록을 조회
        Page<Goods> result = goodsRepository.findByCategoryId(categoryId, pageable);

        // 굿즈 목록을 DTO로 변환
        List<GoodsListDTO> dtoList = result.getContent().stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());

        // 전체 데이터 개수
        long totalCount = result.getTotalElements();

        // PageResponseDTO 생성
        PageResponseDTO<GoodsListDTO> responseDTO = PageResponseDTO.<GoodsListDTO>withAll()
                .dtoList(dtoList)  // DTO 목록
                .pageRequestDTO(pageRequestDTO)  // 페이지 요청 정보
                .totalCount(totalCount)  // 전체 데이터 개수
                .build();

        return responseDTO;
    }

    private GoodsDetailDTO mapToDTO(Goods goods) {

        GoodsDetailDTO goodsDetailDTO = GoodsDetailDTO.builder()
                .goodsId(goods.getGoodsId())
                .goodsCategory(goods.getGoodsCategory())
                .goodsName(goods.getGoodsName())
                .goodsPrice(goods.getGoodsPrice())
                .goodsStock(goods.getGoodsStock())
                .goodsImgUrl(goods.getGoodsImgUrl())
                .storeName(goods.getStoreName())
                .goodsStatus(goods.getGoodsStatus())
                .viewsCount(goods.getViewsCount())
                .build();

        return goodsDetailDTO;
    }

    private GoodsListDTO mapToListDTO(Goods goods) {
        return GoodsListDTO.builder()
                .goodsId(goods.getGoodsId())
                .goodsName(goods.getGoodsName())
                .goodsPrice(goods.getGoodsPrice())
                .goodsImgUrl(goods.getGoodsImgUrl())
                .goodsStatus(goods.getGoodsStatus())
                .storeName(goods.getStoreName())
                .build();
    }

}
