package com.replace.repository.performance;

import com.replace.domain.performance.PerformanceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface PerformanceDetailRepository extends JpaRepository<PerformanceDetail, String> {
    Optional<PerformanceDetail> findByPid(String pid);

    @Query("SELECT pd, f FROM PerformanceDetail pd JOIN pd.facility f")
    List<PerformanceDetail> findAllWithFacility();

    @Query("SELECT pd, f FROM PerformanceDetail pd JOIN pd.facility f WHERE pd.pid = :pid")
    Optional<PerformanceDetail> findByPidWithFacility(@Param("pid") String pid);


}
