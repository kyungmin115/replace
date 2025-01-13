package com.replace.domain.performance;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Schedule {

    @Id
    private Long id;

    private String ptime;
}
