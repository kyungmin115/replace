package com.replace.api;

import org.json.JSONObject;
import org.json.XML;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class KopisAPIListJson {
    private static final String API_KEY = "d21c43edc067412395984e2550763e5f";
    private static final String BASE_URL = "https://www.kopis.or.kr/openApi/restful/pblprfr";


    public static void main(String[] args) {
        try {
            //API 요청 URL
            String startDate = "20241201";
            String endDate = "20241231";
            int page = 1;
            int rows = 10;

            String requestUrl = BASE_URL +
                    "?service=" + API_KEY +
                    "&stdate=" + startDate +
                    "&eddate=" + endDate +
                    "&cpage=" + page +
                    "&rows=" + rows;

            //HTTP get 요청
            URL url = new URL(requestUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            //응답 코드
            int responseCode = connection.getResponseCode();
            if(responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder response = new StringBuilder();
                String inputLine;
                while((inputLine = reader.readLine()) != null) {
                    response.append(inputLine);
                }
                reader.close();

                String xmlData = response.toString();
                JSONObject json = XML.toJSONObject(xmlData);

                System.out.println("JSON 변환 : ");
                System.out.println(json.toString(4));

                JSONObject root = json.getJSONObject("dbs");
                root.getJSONArray("db").forEach(item -> {
                    JSONObject performance = (JSONObject) item;
                    String performanceId = performance.getString("mt20id");
                    String performanceName = performance.getString("prfnm");
                    String startPeriod = performance.getString("prfpdfrom");
                    String endPeriod = performance.getString("prfpdto");

                    System.out.println("공연ID : " + performanceId + " 공연명 : " + performanceName + ", 시작기간 :  " + startPeriod + ", 종료일 :  " + endPeriod);
                });
            } else {
                System.out.println("GET request failed : " + responseCode);
            }
            connection.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
