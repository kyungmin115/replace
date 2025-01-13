package com.replace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {

    @Builder.Default
    private int page = 1;

    @Builder.Default
    private int size = 10;

    private String type;    // 검색의 종류 t,c,w,tc,tw,cw,twc

    private String keyword;

    private String link;

    // 검색의 종류를 나타내는 type 문자열을 어떻게 처리할 것인지에 대한 메서드.
    public String[] getTypes() {
        // type에 대한 문자열이 null이거나 비어 있으면 null
        if(type == null || type.isEmpty()) {
            return null;
        }
        return type.split(""); // 문자열에서 하나의 글자를 쪼갤 때 사용하는 방법, split은 분리를 뜻한다.
        // 예를 들어 ["tc"]가 들어왔다면 ["t","c"]로 나눠진다.
    }

    // 페이지 정보 및 정렬 정보를 생성.
    // javaScript에서는 ...은 레스트 연산자이다. 값을 복사할 때 사용
    // 자바에서 ...props는 가변 인수를 나타내는 표현. 여러 개의 문자열 값을 하나의 배열로 묶어서 메서드에 전달하기 위한 용도.
    public Pageable getPageable(String...props) {
        // this.page -1 : 현재 페이지(this.page)에서 1을 뺀 값을 페이지 번호로 사용. 페이지 번호는 0번 부터 시작.
        // this.size : 페이지 당 항목 수.
        // props 배열에 지정된 속성들 기반을 정렬 정보를 생성
        return PageRequest.of(this.page -1, this.size, Sort.by(props).descending());
    }

    public String getLink() {

        if(link == null){ // link 값이 비어 있으면 생성, 이미 생성 되어 있으면 다시 생성하지 않고 기존 값 반환.
            StringBuilder builder = new StringBuilder(); // String 보다 가변 처리할 때 성능이 뛰어나다.

            builder.append("page=" + this.page);

            builder.append("&size=" + this.size);

            if ( type != null && type.length() > 0) {
                builder.append("&type=" + type);
            }

            if (keyword != null) {
                try {
                    builder.append("&keyword=" + URLEncoder.encode(keyword, "UTF8"));
                } catch (UnsupportedEncodingException e) {
                }
            }
            link = builder.toString(); // 위 조합을 문자열로 변. 처음 선언한 타입과 일치를 시키기 위해 String 으로 변환
        }
        return link;
    }
}
