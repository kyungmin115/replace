package com.replace.repository.performance;

import com.replace.domain.performance.PerformanceList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PerformanceListRepository extends PagingAndSortingRepository<PerformanceList, String>, JpaRepository<PerformanceList, String> {

    @Query("SELECT p.pid FROM PerformanceList p ORDER BY p.startDate DESC")
    List<String> findAllPids(); // 모든 공연 ID 가져오기

    @Query("SELECT DISTINCT p.genre FROM PerformanceList p ORDER BY p.startDate ASC")
    List<String> findDistinctGenres(); // 모든 고유한 장르 가져오기

    @Query("SELECT DISTINCT p.area FROM PerformanceList p ORDER BY p.startDate ASC")
    List<String> findDistinctAreas(); // 모든 고유한 지역 가져오기

    // 장르와 지역으로 검색
    @Query("SELECT p FROM PerformanceList p WHERE p.genre = :genre AND p.area = :area")
    Page<PerformanceList> findByGenreAndArea(@Param("genre") String genre, @Param("area") String area, Pageable pageable);

    // 장르로만 검색
    @Query("SELECT p FROM PerformanceList p WHERE p.genre = :genre")
    Page<PerformanceList> findByGenre(@Param("genre") String genre, Pageable pageable);

    // 지역으로만 검색
    @Query("SELECT p FROM PerformanceList p WHERE p.area = :area")
    Page<PerformanceList> findByArea(@Param("area") String area, Pageable pageable);
    //검색
    @Query("SELECT p from PerformanceList p WHERE p.pname LIKE %:keyword%")
    Page<PerformanceList> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
