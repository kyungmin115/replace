package com.replace.service.performance;

import com.replace.domain.performance.PerformanceDetail;
import com.replace.dto.performance.PerformanceLocationDTO;
import com.replace.repository.performance.PerformanceDetailRepository;
import com.replace.repository.performance.PerformanceListRepository;
import lombok.extern.log4j.Log4j2;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

@Service
@Log4j2
public class PerformanceDetailService {

    @Autowired
    private PerformanceDetailRepository performanceDetailRepository;

    @Autowired
    private PerformanceListRepository performanceListRepository;

    private static final String API_KEY = "d21c43edc067412395984e2550763e5f";
    private static final String DETAIL_URL = "http://www.kopis.or.kr/openApi/restful/pblprfr/";

    // performanceList에서 모든 pid를 기반으로 공연 상세 정보 가져오기
    public void fetchAllPerformanceDetails() {
        try {
            // performanceList에서 모든 pid를 가져옴
            List<String> pids = performanceListRepository.findAllPids();  // performanceListRepository에서 모든 pid를 가져오는 메서드

            for (String pid : pids) {
                PerformanceDetail detail = fetchPerformanceDetail(pid);
                if (detail != null) {
                    savePerformanceDetail(detail);
                }
            }
        } catch (Exception e) {
            log.error("Error fetching all performance details: {}", e.getMessage());
        }
    }

    // 특정 pid에 대한 공연 상세 정보를 가져오는 메서드
    public PerformanceDetail fetchPerformanceDetail(String pid) {
        PerformanceDetail performanceDetail = null;

        try {
            String requestUrl = DETAIL_URL + pid + "?service=" + API_KEY;

            // API 호출
            URL url = new URL(requestUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder response = new StringBuilder();
                String inputLine;
                while ((inputLine = reader.readLine()) != null) {
                    response.append(inputLine);
                }
                reader.close();

                // XML 응답 -> JSON 변환
                String xmlData = response.toString();
                JSONObject json = XML.toJSONObject(xmlData);

                if (json.has("dbs") && json.getJSONObject("dbs").has("db")) {
                    Object dbObject = json.getJSONObject("dbs").get("db");

                    if (dbObject instanceof JSONObject) {
                        // 단일 객체 처리
                        JSONObject performanceJson = (JSONObject) dbObject;
                        performanceDetail = parsePerformanceDetail(performanceJson);
                    }
                }
            } else {
                log.warn("Failed to fetch detail for pid {}: HTTP {}", pid, responseCode);
            }

            connection.disconnect();

        } catch (Exception e) {
            log.error("Error fetching performance detail for pid {}: {}", pid, e.getMessage());
        }

        return performanceDetail;
    }

    // JSON 데이터를 PerformanceDetail로 변환
    private PerformanceDetail parsePerformanceDetail(JSONObject performanceJson) {
        PerformanceDetail detail = new PerformanceDetail();

        detail.setPid(performanceJson.optString("mt20id", "N/A"));
        detail.setFid(performanceJson.optString("mt10id", "N/A"));
        detail.setStartDate(performanceJson.optString("prfpdfrom", "N/A"));
        detail.setEndDate(performanceJson.optString("prfpdto", "N/A"));
        detail.setPname(performanceJson.optString("prfnm", "N/A"));
        detail.setFname(performanceJson.optString("fcltynm", "N/A"));
        detail.setCast(performanceJson.optString("prfcast", "N/A"));
        detail.setDirector(performanceJson.optString("prfcrew", "N/A"));
        detail.setPrice(performanceJson.optString("pcseguidance", "N/A"));
        detail.setGenre(performanceJson.optString("genrenm", "N/A"));
        detail.setPosterUrls(performanceJson.optString("styurls", "N/A"));
        detail.setRuntime(performanceJson.optString("prfruntime", "N/A"));
        detail.setPtime(performanceJson.optString("dtguidance", "N/A"));

        return detail;
    }

    // 공연 상세 정보를 DB에 저장
    public void savePerformanceDetail(PerformanceDetail performanceDetail) {
        if (performanceDetail != null) {
            performanceDetailRepository.save(performanceDetail);
        }
    }

    // 특정 pid에 대한 공연 상세 정보 및 시설 정보 가져오기
    public PerformanceDetail getPerformanceDetailWithLocation(String pid) {
        return performanceDetailRepository.findByPidWithFacility(pid)
                .orElseThrow(() -> new RuntimeException("No performance detail found with pid: " + pid));
    }

    // 공연의 위치 정보 DTO 가져오기
    public PerformanceLocationDTO getPerformanceLocation(String pid) {
        PerformanceDetail detail = getPerformanceDetailWithLocation(pid);

        return PerformanceLocationDTO.builder()
                .pid(detail.getPid())
                .pname(detail.getPname())
                .latitude(detail.getFacility().getLatitude())
                .longitude(detail.getFacility().getLongitude())
                .build();
    }
}
