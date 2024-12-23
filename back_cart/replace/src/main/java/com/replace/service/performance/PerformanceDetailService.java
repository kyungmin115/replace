package com.replace.service.performance;

import com.replace.domain.performance.PerformanceDetail;
import com.replace.repository.performance.PerformanceDetailRepository;
import com.replace.repository.performance.PerformanceListRepository;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class PerformanceDetailService {

    @Autowired
    private PerformanceDetailRepository performanceDetailRepository;

    @Autowired
    private PerformanceListRepository performanceListRepository;

    private static final String API_KEY = "d21c43edc067412395984e2550763e5f";
    private static final String DETAIL_URL = "http://www.kopis.or.kr/openApi/restful/pblprfr/";

    public PerformanceDetail fetchPerformanceDetail(String pid) {
        PerformanceDetail performanceDetail = null;

        try {
            String requestUrl = DETAIL_URL + pid + "?service=" + API_KEY;

            // 2. API 호출
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

                // 3. XML 응답 -> JSON 변환
                String xmlData = response.toString();
                JSONObject json = XML.toJSONObject(xmlData);

                if (json.has("dbs") && json.getJSONObject("dbs").has("db")) {
                    Object dbObject = json.getJSONObject("dbs").get("db");

                    if (dbObject instanceof JSONObject) {
                        // 단일 객체
                        JSONObject performanceJson = (JSONObject) dbObject;
                        performanceDetail = parsePerformanceDetail(performanceJson);
                    }
                }
            }

            connection.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
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

        return detail;
    }

    public void savePerformanceDetail(PerformanceDetail performanceDetail) {
        if (performanceDetail != null) {
            performanceDetailRepository.save(performanceDetail);
        }
    }

}