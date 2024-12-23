package com.replace.domain.performance;

import com.replace.dto.performance.PerformanceListDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.w3c.dom.Text;

@Entity
@Table(name = "performanceList")
@Getter
@Setter
@RequiredArgsConstructor
public class PerformanceList {

    @Id
    @Column(name = "pid")
    private String pid; // 공연 ID

    @Column(name = "pname")
    private String pname; // 공연 이름

    @Column(name = "genre")
    private String genre; // 장르

    @Column(name = "start_date")
    private String startDate; // 공연 시작일

    @Column(name = "end_date")
    private String endDate; // 공연 종료일

    @Column(name = "poster_url")
    private String posterUrl; //공연 포스터

    @Column(name = "fname")
    private String fname; // 공연장 이름

    @Column(name = "area")
    private String area; // 공연장 지역

    public static PerformanceList fromDTO(PerformanceListDTO dto) {
        PerformanceList performance = new PerformanceList();
        performance.setPid(dto.getMt20id());
        performance.setPname(dto.getPrfnm());
        performance.setStartDate(dto.getPrfpdfrom());
        performance.setEndDate(dto.getPrfpdto());
        performance.setPosterUrl(dto.getPoster());
        performance.setFname(dto.getFname());
        performance.setArea(dto.getArea());
        performance.setGenre(dto.getGenrenm());
        return performance;
    }
}

