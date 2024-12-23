package com.replace.service;

import com.replace.domain.performance.Facility;
import com.replace.repository.performance.FacilityRepository;
import com.replace.service.performance.FacilityService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class FacilityTests {

    @Autowired
    private FacilityService facilityService;

    @Autowired
    private FacilityRepository facilityRepository;

    @Test
    public void testFetchSaveFacility() {
        List<Facility> facilities = facilityService.fetchAndSaveFacilities();

        List<Facility> saveFacility = facilityRepository.findAll();

    }
}
