package com.replace.controller.performance;

import com.replace.domain.performance.PerformanceDetail;
import com.replace.domain.performance.PerformanceList;
import com.replace.dto.performance.PerformanceLocationDTO;
import com.replace.dto.performance.ScheduleDTO;
import com.replace.repository.performance.PerformanceDetailRepository;
import com.replace.service.performance.PerformanceDetailService;
import com.replace.service.performance.PerformanceListService;
import com.replace.service.performance.ScheduleService;
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
public class PerformanceListController {

    @Autowired
    private PerformanceListService performanceListService;

    @Autowired
    private PerformanceDetailService performanceDetailService;

    @Autowired
    private ScheduleService scheduleService;


    private PerformanceDetail performanceDetail;

    @Autowired
    private PerformanceDetailRepository performanceDetailRepository;

    @GetMapping("/performances")
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
    public ResponseEntity<List<String>> getAllGenres() {
        log.info("Fetching all genres");
        List<String> genres = performanceListService.getAllGenres();
        return ResponseEntity.ok(genres);
    }

    // 모든 지역 목록을 반환
    @GetMapping("/performances/areas")
    public ResponseEntity<List<String>> getAllAreas() {
        log.info("Fetching all areas");
        List<String> areas = performanceListService.getAllAreas();
        return ResponseEntity.ok(areas);
    }

    @GetMapping("/performances/{pid}")
    public ResponseEntity<PerformanceDetail> getPerformanceDetail(@PathVariable("pid") String pid) {
        PerformanceDetail performanceDetail = performanceDetailService.fetchPerformanceDetail(pid);

        if (performanceDetail != null) {
            // ptime 파싱
            if (performanceDetail.getPtime() != null) {
                List<ScheduleDTO> schedules = scheduleService.parsePtime(performanceDetail.getPtime());
                performanceDetail.setSchedules(schedules);
            }

            // 포스터 URL 로깅
            if (performanceDetail.getPosterUrls() != null) {
                log.info("Poster URLs: " + performanceDetail.getPosterUrls());
            }
        } else {
            log.warn("No performance found with pid: " + pid);
        }

        return ResponseEntity.ok(performanceDetail);
    }

    @GetMapping("/performances/{pid}/location")
    public PerformanceLocationDTO getPerformanceLocation(@PathVariable String pid) {
        return performanceDetailService.getPerformanceLocation(pid);
    }
}
