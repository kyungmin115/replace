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
        // 1. 컬럼 크기 수정 (테스트 환경에서만 적용)
        jdbcTemplate.execute("ALTER TABLE performance_detail MODIFY poster_urls VARCHAR(1000);");

        // 2. 모든 공연 리스트 가져오기
        List<PerformanceList> performanceLists = performanceListRepository.findAll();
        for (PerformanceList performanceList : performanceLists) {
            String pid = performanceList.getPid();

            // 3. 공연 세부 정보 가져오기
            PerformanceDetail detail = performanceDetailService.fetchPerformanceDetail(pid);
            if (detail != null) {
                // 4. 세부 정보 저장
                performanceDetailRepository.save(detail);
            }
        }
    }
}
