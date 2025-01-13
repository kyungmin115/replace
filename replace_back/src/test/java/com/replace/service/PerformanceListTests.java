package com.replace.service;

import com.replace.domain.performance.PerformanceList;
import com.replace.repository.performance.PerformanceListRepository;
import com.replace.service.performance.PerformanceListService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class PerformanceListTests {

    @Autowired
    private PerformanceListService performanceListService;

    @Autowired
    private PerformanceListRepository performanceListRepository;

    @Test
    public void testFetchSavePerformanceList() {
        //api 데이터 가져오기
        List<PerformanceList> performanceLists = performanceListService.fetchAndSavePerformances();

        //저장된 데이터 조회
        List<PerformanceList> savePerformances = performanceListRepository.findAll();
        // 저장된 데이터 중 시작 날짜 기준으로 정렬된 공연 ID 조회
        List<String> sortedPerformanceIds = performanceListRepository.findAllPids();
        System.out.println(savePerformances + "실패");

    }
}
