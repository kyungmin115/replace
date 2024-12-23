package com.replace.service.performance;

import com.replace.domain.performance.PerformanceList;
import com.replace.dto.performance.PerformanceListDTO;
import com.replace.repository.performance.PerformanceListRepository;
import lombok.extern.log4j.Log4j2;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
@Log4j2
public class PerformanceListService {

    @Autowired
    private PerformanceListRepository performanceListRepository;

    private static final String API_KEY = "d21c43edc067412395984e2550763e5f";
    private static final String BASE_URL = "https://www.kopis.or.kr/openApi/restful/pblprfr";

    public List<PerformanceList> fetchAndSavePerformances() {
        List<PerformanceList> performances = new ArrayList<>();
        try {
            String startDate = "20241211";
            String endDate = "20250331";
            int rows = 100;

            // 페이지 1부터 3까지 반복하여 데이터를 가져옵니다.
            for (int page = 1; page <= 3; page++) {
                String requestUrl = BASE_URL +
                        "?service=" + API_KEY +
                        "&stdate=" + startDate +
                        "&eddate=" + endDate +
                        "&cpage=" + page +
                        "&rows=" + rows;

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

                    String xmlData = response.toString();
                    JSONObject json = XML.toJSONObject(xmlData);

                    System.out.println(json.toString(4)); // Debugging 출력

                    if (json.has("dbs") && json.getJSONObject("dbs").has("db")) {
                        Object dbObject = json.getJSONObject("dbs").get("db");

                        if (dbObject instanceof JSONArray) {
                            JSONArray dbArray = (JSONArray) dbObject;
                            dbArray.forEach(item -> {
                                JSONObject performanceJson = (JSONObject) item;
                                processPerformance(performanceJson, performances);
                            });
                        } else if (dbObject instanceof JSONObject) {
                            JSONObject performanceJson = (JSONObject) dbObject;
                            processPerformance(performanceJson, performances);
                        }
                    }
                }
                connection.disconnect();
            }

            // 모든 데이터를 저장
            performanceListRepository.saveAll(performances);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return performances;
    }

    private void processPerformance(JSONObject performanceJson, List<PerformanceList> performances) {
        try {
            PerformanceListDTO dto = new PerformanceListDTO();
            dto.setMt20id(performanceJson.getString("mt20id"));
            dto.setPrfnm(performanceJson.getString("prfnm"));
            dto.setGenrenm(performanceJson.getString("genrenm"));
            dto.setPrfpdfrom(performanceJson.getString("prfpdfrom"));
            dto.setPrfpdto(performanceJson.getString("prfpdto"));
            dto.setFname(performanceJson.getString("fcltynm"));
            dto.setPoster(performanceJson.getString("poster"));
            dto.setArea(performanceJson.getString("area"));

            PerformanceList performance = PerformanceList.fromDTO(dto);
            performances.add(performance);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error processing performance JSON: " + performanceJson);
        }
    }

    public Page<PerformanceList> getPerformanceList(Pageable pageable) {
//        Pageable pageable = PageRequest.of(page, size);
        return performanceListRepository.findAll(pageable);
    }

    public Page<PerformanceList> getPerformancesByGenreAndArea(String genre, String area, Pageable pageable) {
        return performanceListRepository.findByGenreAndArea(genre, area, pageable);
    }

    public Page<PerformanceList> getPerformancesByGenre(String genre, Pageable pageable) {
        return performanceListRepository.findByGenre(genre, pageable);
    }

    public Page<PerformanceList> getPerformancesByArea(String area, Pageable pageable) {
        return performanceListRepository.findByArea(area, pageable);
    }

    // 전체 공연 목록 반환 (필터 없이)
    public Page<PerformanceList> getAllPerformances(Pageable pageable) {
        return performanceListRepository.findAll(pageable);
    }

    // 모든 고유한 장르 리스트 반환
    public List<String> getAllGenres() {
        return performanceListRepository.findDistinctGenres();
    }

    //모든 지역 리스트 반환
    public List<String> getAllAreas() {
        List<String> areas = performanceListRepository.findDistinctAreas();
        log.info("Fetched areas: {}", areas); // 데이터 확인
        return areas;
    }

    // 모든 검색 리스트 반환
    public Page<PerformanceList> searchPerformances(String keyword, Pageable pageable) {

        return performanceListRepository.findByKeyword(keyword, pageable);
    }




}

