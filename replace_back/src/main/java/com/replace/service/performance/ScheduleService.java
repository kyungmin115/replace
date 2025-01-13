package com.replace.service.performance;

import com.replace.dto.performance.ScheduleDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ScheduleService {
    private static final Map<String, String> DAY_ORDER = Map.of(
            "월요일", "1", "화요일", "2", "수요일", "3",
            "목요일", "4", "금요일", "5", "토요일", "6", "일요일", "7"
    );

    public List<ScheduleDTO> parsePtime(String ptime) {
        List<ScheduleDTO> results = new ArrayList<>();
        String[] mainSchedules = ptime.split(", ");

        for (String mainSchedule : mainSchedules) {
            // 큰따옴표 제거
            mainSchedule = mainSchedule.replaceAll("\"", "");

            if (mainSchedule.contains("~")) {
                processDateRange(mainSchedule, results);
            } else if (mainSchedule.contains("(")) {
                processSingleDay(mainSchedule, results);
            }
        }

        return results.stream()
                .filter(schedule -> !schedule.getDay().equals("HOL"))  // HOL 제외
                .sorted(Comparator.comparing(s -> DAY_ORDER.get(s.getDay())))
                .collect(Collectors.toList());
    }

    private void processDateRange(String schedule, List<ScheduleDTO> results) {
        String[] parts = schedule.split("\\(");
        String[] days = parts[0].split("~");
        String[] times = parts[1].replace(")", "").split(",");

        String startDay = days[0].trim();
        String endDay = days[1].trim();
        List<String> daysList = expandDayRange(startDay, endDay);

        for (String day : daysList) {
            for (String time : times) {
                ScheduleDTO dto = new ScheduleDTO();
                dto.setDay(day);
                dto.setTime(time.trim());
                results.add(dto);
            }
        }
    }

    private void processSingleDay(String schedule, List<ScheduleDTO> results) {
        String[] parts = schedule.split("\\(");
        String day = parts[0].trim();
        String[] times = parts[1].replace(")", "").split(",");

        for (String time : times) {
            ScheduleDTO dto = new ScheduleDTO();
            dto.setDay(day);
            dto.setTime(time.trim());
            results.add(dto);
        }
    }

    private List<String> expandDayRange(String startDay, String endDay) {
        List<String> days = new ArrayList<>();
        int start = Integer.parseInt(DAY_ORDER.get(startDay));
        int end = Integer.parseInt(DAY_ORDER.get(endDay));

        for(Map.Entry<String, String> entry : DAY_ORDER.entrySet()) {
            int current = Integer.parseInt(entry.getValue());
            if (current >= start && current <= end) {
                days.add(entry.getKey());
            }
        }
        return days;
    }
}
