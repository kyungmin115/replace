package com.replace.service;

import com.replace.service.goods.CSVGoodsCategoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class CSVGoodsCategoryTests {

    @Autowired
    private CSVGoodsCategoryService goodsCategoryService;

    @Test
    public void testInsertGoodsCategory() throws IOException {
        // 크롤링 데이터를 저장한 CSV 파일 경로
        String filePath = "C://Users/EZEN/Desktop/csv/goods_category2.csv"; // 실제 파일 경로로 변경


        // CSV 파일 데이터 DB에 저장
        goodsCategoryService.importCsvToDatabase(filePath);

//        // DB에서 데이터 확인
//        List<GoodsCategory> categories = goodsCategoryRepository.findAll();
//
//        // 데이터가 비어 있지 않은지 확인
//        assertThat(categories).isNotEmpty();
//
//        // 첫 번째 카테고리 이름 확인 (예시)
//        GoodsCategory firstCategory = categories.get(0);
//        System.out.println("첫 번째 카테고리 이름: " + firstCategory.getGoodsCategoryName());
//
//        // 기대값 설정: 첫 번째 카테고리 이름이 '키링'이어야 한다고 가정
//        assertThat(firstCategory.getGoodsCategoryName()).isEqualTo("키링");
//
//        // 다른 카테고리 검증 (선택적으로 추가)
//        assertThat(categories.size()).isGreaterThan(0);  // 카테고리 개수가 0보다 커야 한다.
    }
}
