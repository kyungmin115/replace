package com.replace.service.goods;

import com.replace.domain.goods.Goods;
import com.replace.domain.goods.GoodsCategory;
import com.replace.domain.goods.GoodsStatus;
import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;
import com.replace.dto.goods.GoodsDetailDTO;
import com.replace.dto.goods.GoodsListDTO;
import com.replace.repository.goods.GoodsCategoryRepository;
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
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Transactional
@RequiredArgsConstructor
@Log4j2
@Service
public class GoodsServiceImpl implements GoodsService {

    private final GoodsRepository goodsRepository;
    private final GoodsCategoryRepository goodsCategoryRepository;

    @Override
    public GoodsDetailDTO getGoods(Long goodsId) {
        log.info("-------getGoods-------");

        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new RuntimeException("Goods not found"));

        return mapToDTO(goods);
    }

    @Override
    public PageResponseDTO<GoodsListDTO> getGoodsPage(PageRequestDTO pageRequestDTO, Long categoryId, GoodsStatus goodsStatus, Sort sort) {
        log.info("-------searchGoods-------");

        log.info(sort);
        // Pageable 생성
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize(),
                sort);

        Page<Goods> result;

        // 상태가 지정되지 않은 경우에는 모든 상태의 상품을 조회
        if (categoryId != null && goodsStatus != null) {
            // 카테고리와 상태 필터링
            result = goodsRepository.findByCategoryIdAndGoodsStatus(categoryId, goodsStatus, pageable);
        } else if (categoryId != null) {
            // 카테고리 필터링
            result = goodsRepository.findByCategoryId(categoryId, pageable);
        } else if (goodsStatus != null) {
            // 상태 필터링
            result = goodsRepository.findByGoodsStatus(goodsStatus, pageable);
        } else {
            // 카테고리와 상태가 모두 주어지지 않으면 필터링 없이 모든 상품 조회
            result = goodsRepository.findAll(pageable);
        }

        // DTO 리스트로 변환
        List<GoodsListDTO> dtoList = result.getContent().stream()
                .map(this::mapToListDTO)
                .collect(Collectors.toList());

        // 전체 개수 가져오기
        long totalCount = result.getTotalElements();

        // ResponseDTO 빌드
        PageResponseDTO<GoodsListDTO> responseDTO = PageResponseDTO.<GoodsListDTO>withAll()
                .dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
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

    // Goods 엔티티에 랜덤 조회수를 설정하는 메서드(일회성)
    public void setRandomViewCountForAllGoods() {
        // 모든 굿즈를 가져옵니다.
        List<Goods> goodsList = goodsRepository.findAll();

        Random random = new Random();

        for (Goods goods : goodsList) {
            // 랜덤 조회수 설정 (0 ~ 1000)
            int randomViewCount = random.nextInt(1001);
            goods.changeViewsCount(randomViewCount);

            // 굿즈 조회수 업데이트
            goodsRepository.save(goods);
        }
    }

    // 특정 굿즈의 조회수를 증가시키는 메서드
    public void incrementViewCount(Long goodsId) {
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new IllegalArgumentException("해당 굿즈를 찾을 수 없습니다."));

        goods.incrementViewsCount(); // 조회수 증가
        goodsRepository.save(goods); // 업데이트
    }

    public PageResponseDTO<GoodsListDTO> searchGoodsList(PageRequestDTO pageRequestDTO) {
        String[] types = pageRequestDTO.getTypes();
        String keyword = pageRequestDTO.getKeyword();

        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1,
                pageRequestDTO.getSize());

        Page<GoodsListDTO> result = goodsRepository.searchGoods(types, keyword, pageable);

        return PageResponseDTO.<GoodsListDTO>withAll()
                .dtoList(result.getContent()) // 검색된 데이터
                .pageRequestDTO(pageRequestDTO) // 요청 정보
                .totalCount(result.getTotalElements()) // 총 데이터 수
                .build();
    }

    @Override
    public Long getGoodsIdByGoodsName(String name) {
        Optional<Goods> goods = goodsRepository.findFirstByGoodsNameContaining(name);
        if (goods.isPresent()) {
            return goods.get().getGoodsId(); // 아이디 반환
        }
        return null; // 굿즈가 없으면 null 반환
    }

    @Override
    public List<GoodsCategory> getAllCategories() {
        return goodsCategoryRepository.findAll();
    }
}
