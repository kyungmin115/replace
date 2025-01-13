package com.replace.dto.performance;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PerformanceLocationDTO {

    private String pid;

    private String pname;

    private String latitude;

    private String longitude;
}
