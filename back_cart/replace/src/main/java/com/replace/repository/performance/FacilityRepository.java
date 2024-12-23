package com.replace.repository.performance;

import com.replace.domain.performance.Facility;
import com.replace.domain.performance.PerformanceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface FacilityRepository extends JpaRepository<Facility, String> {
    @Query("SELECT p.fid FROM PerformanceDetail p ORDER BY p.startDate DESC")
    Optional<PerformanceDetail> findByFid(String fid);
}
