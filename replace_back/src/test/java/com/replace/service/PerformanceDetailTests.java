package com.replace.service;

import com.replace.domain.performance.PerformanceDetail;
import com.replace.domain.performance.PerformanceList;
import com.replace.repository.performance.PerformanceDetailRepository;
import com.replace.repository.performance.PerformanceListRepository;
import com.replace.service.performance.PerformanceDetailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

@SpringBootTest
public class PerformanceDetailTests {

    @Autowired
    private PerformanceDetailService performanceDetailService;

    @Autowired
    private PerformanceDetailRepository performanceDetailRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private PerformanceListRepository performanceListRepository;

    @Test
    public void testFetchSavePerformanceDetail() {
        // 2. 모든 공연 리스트 가져오기
        List<PerformanceList> performanceLists = performanceListRepository.findAll();

        int successCount = 0;
        int failCount = 0;

        for (PerformanceList performanceList : performanceLists) {
            String pid = performanceList.getPid();
            try {
                // 3. 공연 세부 정보 가져오기
                PerformanceDetail detail = performanceDetailService.fetchPerformanceDetail(pid);
                if (detail != null) {
                    // 4. 세부 정보 저장
                    performanceDetailRepository.save(detail);
                    successCount++;
                } else {
                    failCount++;
                    System.err.println("Failed to fetch detail for pid: " + pid);
                }
            } catch (Exception e) {
                failCount++;
                System.err.println("Error processing pid " + pid + ": " + e.getMessage());
            }
        }

        // 5. 테스트 결과 출력
        System.out.println("Successfully saved details: " + successCount);
        System.out.println("Failed to save details: " + failCount);

        // 6. 저장된 데이터 검증
        List<PerformanceDetail> savedDetails = performanceDetailRepository.findAll();
        System.out.println("Total saved details in DB: " + savedDetails.size());

    }
}
