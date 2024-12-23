package com.replace.dto.performance;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class PerformanceDetailDTO {

    private String mt20id;
    private String mt10id;
    private String prfnm;
    private String fcltynm;
    private String prfpdfrom;
    private String prfpdto;
    private String prfcast;
    private String prfcrew;
    private String prfruntime;
    private String pcseguidance;
    private String genrenm;
    private String styurl;

}
