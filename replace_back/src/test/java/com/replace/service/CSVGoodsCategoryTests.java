package com.replace.service;

import com.replace.service.goods.CSVGoodsCategoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
public class CSVGoodsCategoryTests {

    @Autowired
    private CSVGoodsCategoryService goodsCategoryService;

    @Test
    public void testInsertGoodsCategory() throws IOException {
        // 크롤링 데이터를 저장한 CSV 파일 경로
        String filePath = "C:/Users/rlawl/Desktop/csv/goods_category2.csv"; // 실제 파일 경로로 변경


        // CSV 파일 데이터 DB에 저장
        goodsCategoryService.importCsvToDatabase(filePath);

    }
}
