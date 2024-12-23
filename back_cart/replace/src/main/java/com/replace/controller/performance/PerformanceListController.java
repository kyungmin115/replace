package com.replace.controller.performance;

import com.replace.domain.performance.PerformanceDetail;
import com.replace.domain.performance.PerformanceList;
import com.replace.repository.performance.PerformanceDetailRepository;
import com.replace.service.performance.PerformanceDetailService;
import com.replace.service.performance.PerformanceListService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log4j2
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000",allowCredentials = "true")
public class PerformanceListController {

    @Autowired
    private PerformanceListService performanceListService;

    @Autowired
    private PerformanceDetailService performanceDetailService;


    private PerformanceDetail performanceDetail;

    @Autowired
    private PerformanceDetailRepository performanceDetailRepository;

    @GetMapping("/performances")
    @CrossOrigin(origins = "http://localhost:3000",allowCredentials = "true")
    public ResponseEntity<Page<PerformanceList>> getPerformanceList(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "15") int size,
            @RequestParam(name = "genres", required = false) String genre,  // genres -> genre
            @RequestParam(name = "areas", required = false) String area,    // areas -> area
            @RequestParam(name = "keyword", required = false) String keyword) {

        log.info("Fetching performances - Page: " + page + ", Size: " + size + ", Genre: " + genre + ", Area: " + area);

        Pageable pageable = PageRequest.of(page, size);
        Page<PerformanceList> performances;

        // 키워드로만 검색
        if (keyword != null && !keyword.isEmpty()) {
            performances = performanceListService.searchPerformances(keyword, pageable);
        }
        // 장르와 지역 모두 필터링
        else if (genre != null && !genre.isEmpty() && area != null && !area.isEmpty()) {
            performances = performanceListService.getPerformancesByGenreAndArea(genre, area, pageable);
        }
        // 장르만 필터링
        else if (genre != null && !genre.isEmpty()) {
            performances = performanceListService.getPerformancesByGenre(genre, pageable);
        }
        // 지역만 필터링
        else if (area != null && !area.isEmpty()) {
            performances = performanceListService.getPerformancesByArea(area, pageable);
        }
        // 필터 없이 모든 공연 조회
        else {
            performances = performanceListService.getAllPerformances(pageable);
        }

        return ResponseEntity.ok(performances);
    }

    // 모든 장르 목록을 반환
    @GetMapping("/performances/genres")
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    public ResponseEntity<List<String>> getAllGenres() {
        log.info("Fetching all genres");
        List<String> genres = performanceListService.getAllGenres();
        return ResponseEntity.ok(genres);
    }

    // 모든 지역 목록을 반환
    @GetMapping("/performances/areas")
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    public ResponseEntity<List<String>> getAllAreas() {
        log.info("Fetching all areas");
        List<String> areas = performanceListService.getAllAreas();
        return ResponseEntity.ok(areas);
    }

    // 공연 상세 정보를 반환 (pid를 사용)
    @GetMapping("/performances/{pid}")
    @CrossOrigin(origins = "http://localhost:3000",allowCredentials = "true")
    public ResponseEntity<PerformanceDetail> getPerformanceDetail(@PathVariable("pid") String pid) {
        // 이미지를 로그에 출력
        if (performanceDetail != null && performanceDetail.getPosterUrls() != null) {
            log.info("Poster URLs: " + performanceDetail.getPosterUrls());
        } else {
            log.warn("No poster URLs found for performance with pid: " + pid);
        }
        PerformanceDetail performanceDetail = performanceDetailService.fetchPerformanceDetail(pid);
        return ResponseEntity.ok(performanceDetail);
    }
}
