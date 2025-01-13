package com.replace.api;

import com.replace.dto.performance.PerformanceListDTO;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class KopisAPIDetailJson {
    private static final String API_KEY = "d21c43edc067412395984e2550763e5f";
    private static final String DETAIL_URL = "http://www.kopis.or.kr/openApi/restful/pblprfr/";
    private static final PerformanceListDTO performanceListDTO = new PerformanceListDTO();

    public static void main(String[] args) {

        List<String> performanceList = new ArrayList<>();

        performanceList.add(performanceListDTO.getMt20id());

        System.out.println(performanceList);

        try {
            String mt20id = performanceListDTO.getMt20id();

            String DetailURL = DETAIL_URL +
                    mt20id +
                    "?service=" + API_KEY;

            // HTTP GET 요청
            URL detailurl = new URL(DetailURL);
            HttpURLConnection detail = (HttpURLConnection) detailurl.openConnection();
            detail.setRequestMethod("GET");

            int detailResponseCode = detail.getResponseCode();
            if (detailResponseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader detailReader = new BufferedReader(new InputStreamReader(detail.getInputStream()));
                StringBuilder detailResponse = new StringBuilder();
                String detailLine;
                while ((detailLine = detailReader.readLine()) != null) {
                    detailResponse.append(detailLine);
                }
                detailReader.close();

                // XML 데이터 출력
                String detailXmlData = detailResponse.toString();
                System.out.println("XML Response:");
                System.out.println(detailXmlData);

                // JSON 변환
                JSONObject detailJson = XML.toJSONObject(detailXmlData);
                System.out.println("Converted JSON:");
                System.out.println(detailJson.toString(4));

                // JSON 구조 확인 후 처리
                if (detailJson.has("dbs")) {
                    Object dbs = detailJson.get("dbs");

                    if (dbs instanceof JSONObject) {
                        // 예상한 구조일 때
                        JSONObject detailRoot = (JSONObject) dbs;
                        if (detailRoot.has("db")) {
                            Object dbObject = detailRoot.get("db");

                            if (dbObject instanceof JSONObject) {
                                // 단일 데이터
                                JSONObject detailPerfomance = (JSONObject) dbObject;
                                parseAndPrintPerformance(detailPerfomance);
                            } else if (dbObject instanceof JSONArray) {
                                // 다중 데이터
                                JSONArray dbArray = (JSONArray) dbObject;
                                dbArray.forEach(item -> parseAndPrintPerformance((JSONObject) item));
                            }
                        }
                    } else if (dbs instanceof String) {
                        // `dbs`가 단순 문자열일 경우 처리
                        System.out.println("dbs is a String: " + dbs);
                    }
                }
            } else {
                System.out.println("GET detailRequest failed : " + detailResponseCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void parseAndPrintPerformance(JSONObject detailPerfomance) {
        // 필요한 값 추출
        String detailPerformanceId = detailPerfomance.optString("mt20id", "default_value");
        String detailPerformanceName = detailPerfomance.optString("prfnm", "default_value");
        String detailPerformanceStartDate = detailPerfomance.optString("prfpdfrom", "default_value");
        String detailPerformanceEndDate = detailPerfomance.optString("prfpdto", "default_value");

        // 값 확인 (디버깅 용)
        System.out.println("ID: " + detailPerformanceId);
        System.out.println("Name: " + detailPerformanceName);
        System.out.println("Start Date: " + detailPerformanceStartDate);
        System.out.println("End Date: " + detailPerformanceEndDate);
    }
}
