package com.replace.repository.performance;

import com.replace.domain.performance.PerformanceDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface PerformanceDetailRepository extends JpaRepository<PerformanceDetail, String> {
    Optional<PerformanceDetail> findByPid(String pid);


}
