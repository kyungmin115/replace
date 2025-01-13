package com.replace.service.goods;

import com.replace.domain.goods.Goods;
import com.replace.domain.goods.GoodsCategory;
import com.replace.domain.goods.GoodsStatus;
import com.replace.repository.goods.GoodsCategoryRepository;
import com.replace.repository.goods.GoodsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class CSVGoodsService {

    private final GoodsRepository goodsRepository;
    private final GoodsCategoryRepository goodsCategoryRepository;

    /**
     * CSV 파일을 읽어서 데이터베이스에 저장
     */
    @Transactional
    public void importCsvToDatabase(String filePath) throws IOException {
        // CSV 파일 읽기
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            int lineNumber = 0;

            while ((line = reader.readLine()) != null) {
                lineNumber++;

                // 첫 번째 줄은 헤더이므로 건너뛰기
                if (lineNumber == 1) continue;

                // CSV 데이터 파싱 (탭 구분자로 분리)
                String[] columns = line.split("\t");
                if (columns.length < 6) {
                    throw new RuntimeException("CSV 파일 형식 오류: " + line);
                }

                // 데이터 추출
                String goodsName = columns[0];
                String imgUrl = columns[1];
                int price = Integer.parseInt(columns[2].replace("\"", "").replace(",", ""));
                String status = columns[3];
                String storeName = columns[4];
                Long categoryId = Long.parseLong(columns[5]);

                // 카테고리 확인
                GoodsCategory category = goodsCategoryRepository.findById(categoryId)
                        .orElseThrow(() -> new RuntimeException("존재하지 않는 카테고리 ID: " + categoryId));

                // Goods 엔티티 생성
                Goods goods = Goods.builder()
                        .goodsName(goodsName)
                        .goodsImgUrl(imgUrl)
                        .goodsPrice(price)
                        .storeName(storeName)
                        .goodsStatus(GoodsStatus.valueOf(status)) // String을 Enum으로 변환
                        .goodsStock("SOLD_OUT".equalsIgnoreCase(status) ? 0 : 100) // 재고 로직 예제
                        .goodsCategory(category)
                        .build();

                // 데이터베이스 저장
                goodsRepository.save(goods);
            }
        }
    }
}
