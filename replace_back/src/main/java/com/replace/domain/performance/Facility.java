package com.replace.domain.performance;

import com.replace.dto.performance.FacilityDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "facility")
@Getter
@Setter
@RequiredArgsConstructor
public class Facility {

    @Id
    @Column(name = "fid")
    private String fid;// 공연장 ID

    @Column(name = "fname")
    private String fname;

    @Column(name = "address")
    private String address; // 공연장 주소

    @Column(name = "tel")
    private String tel; // 공연장 전화

    @Column(name = "latitude")
    private String latitude; // 위도

    @Column(name = "longitude")
    private String longitude; //경도

    public static Facility fromDTO(FacilityDTO dto) {
        Facility facility = new Facility();
        facility.setFid(dto.getMt10id());
        facility.setFname(dto.getFcltynm());
        facility.setAddress(dto.getAdres());
        facility.setTel(dto.getTelno());
        facility.setLatitude(dto.getLa());
        facility.setLongitude(dto.getLo());
        return facility;
    }
}
