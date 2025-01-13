package com.replace.controller.goods;

import com.replace.domain.goods.GoodsCategory;
import com.replace.domain.goods.GoodsStatus;
import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;
import com.replace.dto.goods.GoodsDetailDTO;
import com.replace.dto.goods.GoodsListDTO;
import com.replace.dto.member.MemberDTO;
import com.replace.dto.review.ReviewDTO;
import com.replace.service.goods.GoodsService;
import com.replace.service.review.ReviewService;
import com.replace.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/goods")
@RequiredArgsConstructor
@Log4j2
public class GoodsController {

    private final GoodsService goodsService;

    private final CustomFileUtil customFileUtil;
    private final ReviewService reviewService;

    // 상품 목록 조회
    @GetMapping("/list")
    public PageResponseDTO<GoodsListDTO> list(
            PageRequestDTO pageRequestDTO,
            @RequestParam(required = false) Long categoryId,            // 카테고리 ID (선택적)
            @RequestParam(required = false) GoodsStatus goodsStatus,  // 선택적 굿즈 상태
            @RequestParam(required = false, defaultValue = "newest") String sortOrder) {          // 선택적 정렬 옵션 (조회순, 최신순, 가격 낮은 순, 가격 높은 순)

        // 정렬 처리
        Sort sort;
        if ("views".equalsIgnoreCase(sortOrder)) {
            sort = Sort.by("viewsCount").descending(); // 조회수 기준 내림차순
        } else if ("priceAsc".equalsIgnoreCase(sortOrder)) {
            sort = Sort.by("goodsPrice").ascending();  // 가격 낮은 순
        } else if ("priceDesc".equalsIgnoreCase(sortOrder)) {
            sort = Sort.by("goodsPrice").descending(); // 가격 높은 순
        } else {
            sort = Sort.by("goodsId").descending();    // 최신순 (기본값: ID 내림차순)
        }

        // 굿즈 서비스 호출
        return goodsService.getGoodsPage(pageRequestDTO, categoryId, goodsStatus, sort);
    }

    // 특정 상품 조회
    @GetMapping("/{goodsId}")
    public GoodsDetailDTO read(@PathVariable(name = "goodsId") Long goodsId) {
        return goodsService.getGoods(goodsId);
    }

    // 조회수 증가 API
    @PutMapping("/{goodsId}/increment-view")
    public ResponseEntity<String> incrementViewCount(@PathVariable(name = "goodsId") Long goodsId) {
        goodsService.incrementViewCount(goodsId);
        return ResponseEntity.ok("조회수가 증가했습니다.");
    }

    // 굿즈 검색
    @GetMapping("/search")
    public ResponseEntity<PageResponseDTO<GoodsListDTO>> searchGoods(PageRequestDTO pageRequestDTO) {
        PageResponseDTO<GoodsListDTO> response = goodsService.searchGoodsList(pageRequestDTO);
        return ResponseEntity.ok(response);
    }

    // 굿즈 이름을 통해 굿즈 조회
    @GetMapping("/findByName")
    public Long findByGoodsIdByGoodsName(@RequestParam String goodsName) {
        return goodsService.getGoodsIdByGoodsName(goodsName);
    }

    // 굿즈 카테고리 목록 조회
    @GetMapping("/categories")
    public ResponseEntity<List<GoodsCategory>> getAllCategories() {
        List<GoodsCategory> categories = goodsService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // ---------------------댓글-----------------------
    // 리뷰 리스트 조회
    @GetMapping(value = "/list/{goodsId}")
    public PageResponseDTO<ReviewDTO> getList(@PathVariable("goodsId") Long goodsId,
                                              PageRequestDTO pageRequestDTO){

        PageResponseDTO<ReviewDTO> responseDTO = reviewService.getListOfReview(goodsId, pageRequestDTO);


        return responseDTO;
    }

    // 추가
    @PostMapping("/review")
    public Map<String, Long> registerReview(@ModelAttribute ReviewDTO reviewDTO,
                                            @AuthenticationPrincipal MemberDTO memberDTO) {
        log.info("register: " + reviewDTO);
        log.info("ReviewDTO goodsId: " + reviewDTO.getGoodsId());

        List<MultipartFile> files = reviewDTO.getFiles();
        List<String> uploadFileNames = (files != null) ? customFileUtil.saveFiles(files) : new ArrayList<>();
        reviewDTO.setUploadFileNames(uploadFileNames);

        log.info(uploadFileNames);
        Long rid = reviewService.registerReview(reviewDTO);


        return Map.of("rid", rid);
    }

    // 이미지 조회
    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName) {
        log.info("fileName: " + fileName);
        return customFileUtil.getFile(fileName);
    }

    // 특정 리뷰 조회 (이미지 포함)
    @GetMapping("/review/{rid}")
    public ResponseEntity<ReviewDTO> getReview(@PathVariable Long rid) {
        ReviewDTO reviewDTO = reviewService.getReviewWithImages(rid);
        return ResponseEntity.ok(reviewDTO);
    }

    // 수정
    @PutMapping("/review/{rid}")
    public Map<String, String> modifyReview(@PathVariable(name="rid")Long rid, ReviewDTO reviewDTO) {

        reviewDTO.setRid(rid);
        ReviewDTO oldReviewDTO = reviewService.get(rid);

        List<String> oldFileNames = oldReviewDTO.getUploadFileNames();
        List<MultipartFile> files = reviewDTO.getFiles();
        List<String> currentUploadFileNames = customFileUtil.saveFiles(files);
        List<String> uploadedFileNames = reviewDTO.getUploadFileNames();

        if(currentUploadFileNames != null && currentUploadFileNames.size() > 0) {
            uploadedFileNames.addAll(currentUploadFileNames);
        }

        //수정 작업
        reviewService.modifyReview(reviewDTO);
        if(oldFileNames != null && oldFileNames.size() > 0){
            List<String> removeFiles =  oldFileNames
                    .stream()
                    .filter(fileName -> uploadedFileNames.indexOf(fileName) == -1).collect(Collectors.toList());
            customFileUtil.deleteFiles(removeFiles);
        }
        return Map.of("RESULT", "SUCCESS");
    }

    // 삭제
    @DeleteMapping("/review/{rid}")
    public Map<String, String> removeReview(@PathVariable("rid") Long rid) {
        List<String> oldFileNames =  reviewService.get(rid).getUploadFileNames();
        reviewService.removeReview(rid);
        customFileUtil.deleteFiles(oldFileNames);

        return Map.of("RESULT", "SUCCESS");
    }

    @GetMapping("/review/averageRating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long goodsId) {
        double avgRating = reviewService.calculateAverageRating(goodsId);
        return ResponseEntity.ok(avgRating);
    }


}


