package com.replace.dto.review;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {

    private Long rid;

//    @NotNull
    private Long goodsId;

    @NotNull
    private String reviewContent;

//    @NotNull
    private String reviewTitle;

    private String reviewer;

    private boolean delReviewFlag;

    @Min(value = 0, message = "최소 별점은 0점 입니다.")
    @Max(value = 5, message = "최대 별점은 5점 입니다.")
    private int rating;

    @JsonFormat(pattern = "yy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonIgnore // Json 으로 변환될 때 제외하도록 한다.
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDateTime updatedAt;

    // 이미지
    @Builder.Default // 서버에 보내지는 실제 파일 데이터 이름들을 위한 리스트
    private List<MultipartFile> files = new ArrayList<>();

    @Builder.Default // 업로드가 완료된 파일의 이름만 문자열로 보관하기 위한 리스트
    private List<String> uploadFileNames = new ArrayList<>();
}
