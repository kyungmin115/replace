package com.replace.service.performance;

import com.replace.domain.performance.Facility;
import com.replace.domain.performance.PerformanceDetail;
import com.replace.repository.performance.FacilityRepository;
import com.replace.repository.performance.PerformanceDetailRepository;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    private static final String API_KEY = "d21c43edc067412395984e2550763e5f";
    private static final String FACILITY_URL = "http://www.kopis.or.kr/openApi/restful/prfplc/";

    @Autowired
    private PerformanceDetailRepository performanceDetailRepository;

    public List<Facility> fetchAndSaveFacilities() {
        List<Facility> facilities = new ArrayList<>();

        try {
            // fid 가져오기
            List<PerformanceDetail> performanceDetails = performanceDetailRepository.findAll();

            for (PerformanceDetail performanceDetail : performanceDetails) {
                String fid = performanceDetail.getFid();
                String requestUrl = FACILITY_URL + fid + "?service=" + API_KEY;

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

                    // xml -> json
                    String xmlData = response.toString();
                    JSONObject json = XML.toJSONObject(xmlData);
                    System.out.println("Converted JSON: " + json.toString()); // Debugging output

                    if (json.has("dbs")) {
                        Object dbsObject = json.get("dbs");

                        // dbs가 String인 경우, JSONObject로 변환
                        if (dbsObject instanceof String) {
                            String dbsString = (String) dbsObject;
                            try {
                                dbsObject = new JSONObject(dbsString); // dbs를 JSONObject로 변환
                            } catch (Exception e) {
                                e.printStackTrace();
                                continue; // JSON 변환 오류 시 해당 항목 건너뛰기
                            }
                        }

                        // dbs가 JSONObject일 경우 처리
                        if (dbsObject instanceof JSONObject) {
                            JSONObject dbs = (JSONObject) dbsObject;
                            if (dbs.has("db") && dbs.get("db") instanceof JSONObject) {
                                JSONObject facilityObject = dbs.getJSONObject("db");
                                Facility facility = parseFacility(facilityObject);
                                facilities.add(facility);
                            }
                        }
                    }
                }
                connection.disconnect();
            }

            // 데이터베이스에 저장
            facilityRepository.saveAll(facilities);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return facilities;
    }

    // json 데이터 전송
    private Facility parseFacility(JSONObject facilityObject) {
        Facility facility = new Facility();

        // JSON 데이터 추출 및 시설 객체에 값 설정
        facility.setFid(facilityObject.optString("mt10id", "N/A"));
        facility.setFname(facilityObject.optString("fcltynm", "N/A"));
        facility.setTel(facilityObject.optString("telno", "N/A"));
        facility.setAddress(facilityObject.optString("adres", "N/A"));
        facility.setLatitude(facilityObject.optString("la", "N/A"));
        facility.setLongitude(facilityObject.optString("lo", "N/A"));

        return facility;
    }
}
