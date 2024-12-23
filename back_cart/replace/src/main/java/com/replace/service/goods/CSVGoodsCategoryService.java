package com.replace.service.goods;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import com.replace.domain.goods.GoodsCategory;
import com.replace.repository.goods.GoodsCategoryRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;

@Log4j2
@Service
public class CSVGoodsCategoryService {

    @Autowired
    private GoodsCategoryRepository goodsCategoryRepository;

    @Transactional
    public void importCsvToDatabase(String filePath) throws IOException {
        // CSV 파일 읽기
        CSVReader csvReader = new CSVReader(new InputStreamReader(new FileInputStream(filePath), "UTF-8"));
        List<String[]> records = null;
        try {
            records = csvReader.readAll();
            for (String[] record : records) {
                log.info("CSV Record: " + Arrays.toString(record));
            }
        } catch (CsvException e) {
            log.error("CSV reading error", e);
            throw new RuntimeException("CSV 파일을 읽는 중 오류가 발생했습니다.", e);
        }

        // 첫 번째 행은 헤더이므로 건너뛰기
        for (int i = 1; i < records.size(); i++) {
            String[] record = records.get(i);

            // categoryId가 숫자 형식인지 확인
            Long categoryId;
            try {
                categoryId = Long.parseLong(record[0]); // category_id
            } catch (NumberFormatException e) {
                log.warn("잘못된 category_id: " + record[0] + " at line " + (i + 1));
                continue; // 잘못된 값은 건너뛰기
            }

            String categoryName = record[1]; // category_name
            if (categoryName == null || categoryName.isEmpty()) {
                log.warn("Empty category_name at line " + (i + 1));
                continue; // 이름이 없는 카테고리는 건너뛰기
            }

            GoodsCategory goodsCategory = GoodsCategory.builder()
                    .goodsCategoryId(categoryId)
                    .goodsCategoryName(categoryName)
                    .build();

            // 데이터베이스에 저장
            GoodsCategory savedCategory = goodsCategoryRepository.save(goodsCategory);
            log.info("Saved Category: " + savedCategory.getGoodsCategoryId() + ", Name: " + savedCategory.getGoodsCategoryName());
        }
    }
}
