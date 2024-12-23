package com.replace.domain.performance;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.replace.dto.performance.PerformanceDetailDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "performanceDetail")
@Getter
@Setter
@RequiredArgsConstructor
public class PerformanceDetail {

    @Column(name = "pid")
    private String pid; // 공연 ID

    @Id
    @Column(name = "fid")
    private String fid; // 공연장 ID

    @Column(name = "pname")
    private String pname; // 공연 이름

    @Column(name = "fname")
    private String fname; // 공연장 이름

    @Column(name = "start_date")
    private String startDate; // 공연 시작일

    @Column(name = "end_date")
    private String endDate; // 공연 종료일

    @Column(name = "cast")
    private String cast; // 공연 출연 배우

    @Column(name = "director")
    private String director; // 공연 감독진

    @Column(name = "runtime")
    private String runtime; // 상영 시간 

    @Column(name = "price") 
    private String price; // 가격

    @Column(name = "genre")
    private String genre; // 장르

    @Column(name = "poster_urls")
    @JsonProperty("poster_urls")
    private String posterUrls; //공연 포스터

    public static PerformanceDetail fromDTO(PerformanceDetailDTO dto) {
        PerformanceDetail performanceDetail = new PerformanceDetail();
        performanceDetail.setPid(dto.getMt20id());
        performanceDetail.setFid(dto.getMt10id());
        performanceDetail.setPname(dto.getPrfnm());
        performanceDetail.setFname(dto.getFcltynm());
        performanceDetail.setStartDate(dto.getPrfpdfrom());
        performanceDetail.setEndDate(dto.getPrfpdto());
        performanceDetail.setCast(dto.getPrfcast());
        performanceDetail.setDirector(dto.getPrfcrew());
        performanceDetail.setRuntime(dto.getPrfruntime());
        performanceDetail.setPrice(dto.getPcseguidance());
        performanceDetail.setPosterUrls(dto.getStyurl());
        performanceDetail.setGenre(dto.getGenrenm());

        return performanceDetail;

    }
}
