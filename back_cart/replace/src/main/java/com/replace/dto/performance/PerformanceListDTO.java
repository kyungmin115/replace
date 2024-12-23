package com.replace.dto.performance;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class PerformanceListDTO {
    private String mt20id;  // API 응답의 공연 ID
    private String prfnm;   // API 응답의 공연명
    private String genrenm; // 공연 장르명
    private String prfpdfrom;  // API 응답의 공연 시작일
    private String prfpdto;    // API 응답의 공연 종료일
    private String poster; // 포스터 경로
    private String fname; // 공연 시설 명
    private String area; // 공연지역

    // 필요한 경우 생성자, toString() 등의 메서드를 추가할 수 있습니다.
}
