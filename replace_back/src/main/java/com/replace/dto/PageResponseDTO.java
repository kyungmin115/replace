package com.replace.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Data
public class PageResponseDTO<E> {

    private List<E> dtoList;

    private List<Integer> pageNumList;

    private PageRequestDTO pageRequestDTO;

    private boolean prev, next;

    private int totalCount, prevPage, nextPage, totalPage, current;

    @Builder(builderMethodName = "withAll")
    public PageResponseDTO(List<E> dtoList, PageRequestDTO pageRequestDTO, long totalCount) {

        this.dtoList = dtoList;
        this.pageRequestDTO = pageRequestDTO;
        this.totalCount = (int)totalCount;

        int size = pageRequestDTO.getSize(); // 가변적인 size 처리
        int currentPage = pageRequestDTO.getPage();

        int end =   (int)(Math.ceil( currentPage / 10.0 )) *  10;

        int start = end - 9;

        int last =  (int)(Math.ceil(totalCount/(double) size));

        end =  end > last ? last: end;

        this.prev = start > 1;

        this.next =  totalCount > end * size;

        this.pageNumList = IntStream.rangeClosed(start,end).boxed().collect(Collectors.toList());

        if(prev) this.prevPage = start -1;
        if(next) this.nextPage = end + 1;


        this.totalPage = last;

        this.current = currentPage;

    }
}
