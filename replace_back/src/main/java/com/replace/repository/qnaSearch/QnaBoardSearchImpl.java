package com.replace.repository.qnaSearch;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPQLQuery;
import com.replace.domain.qna.QQnaBoard;
import com.replace.domain.qna.QQnaReply;
import com.replace.domain.qna.QnaBoard;
import com.replace.dto.qna.QnaBoardListAllDTO;
import com.replace.dto.qna.QnaBoardReplyCountDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;
import java.util.stream.Collectors;

public class QnaBoardSearchImpl extends QuerydslRepositorySupport implements QnaBoardSearch {

    public QnaBoardSearchImpl() {
        super(QnaBoard.class);
    }

    @Override
    public Page<QnaBoard> search1(Pageable pageable) {
        QQnaBoard qnaBoard = QQnaBoard.qnaBoard;    // Q도메인 객체

        // @Query로 작성했던 JPQL을 코드를 통해서 생성할 수 있게 한다.
        JPQLQuery<QnaBoard> query = from(qnaBoard);   // select... from board

//        query.where(board.title.contains("1")); // where title like...

        BooleanBuilder booleanBuilder = new BooleanBuilder();   // ( 소괄호 생성

        booleanBuilder.or(qnaBoard.title.contains("11")); // title like...
        booleanBuilder.or(qnaBoard.content.contains("11")); // content like...

        query.where(booleanBuilder);
        query.where(qnaBoard.qno.gt(0L)); // gt(greater than) : JPQLQuery에서 크다라는 조건을 표현 / bno > 0;

        // paging
        this.getQuerydsl().applyPagination(pageable, query);

        // fetch()를 통해서 JPQL 쿼리 실행
        List<QnaBoard> list = query.fetch();

        // JPQLQuery의 fetchCount() 개수를 실행하는 메서드이다
        long count = query.fetchCount();

        return null;
    }

    @Override
    public Page<QnaBoard> searAll(String[] types, String keyword, Pageable pageable) {

        QQnaBoard qnaBoard = QQnaBoard.qnaBoard;
        JPQLQuery<QnaBoard> query = from(qnaBoard);

        if ((types != null && types.length > 0) && keyword != null) {

            BooleanBuilder booleanBuilder = new BooleanBuilder(); // (

            for (String type : types) {
                switch (type) {
                    case "t":
                        booleanBuilder.or(qnaBoard.title.contains(keyword));
                        break;
                    case "c":
                        booleanBuilder.or(qnaBoard.content.contains(keyword));
                        break;
                    case "w":
                        booleanBuilder.or(qnaBoard.writer.contains(keyword));
                        break;
                }
            } // end for
            query.where(booleanBuilder);
        } // end if

        // bno > 0
        query.where(qnaBoard.qno.gt(0L));

        // paging
        this.getQuerydsl().applyPagination(pageable, query);

        List<QnaBoard> list = query.fetch();

        long count = query.fetchCount();

        return new PageImpl<>(list, pageable, count);
    }

    @Override
    public Page<QnaBoardReplyCountDTO> searchWithReplyCount(String[] types, String keyword, Pageable pageable) {

        QQnaBoard qnaBoard = QQnaBoard.qnaBoard;
        QQnaReply qnaReply = QQnaReply.qnaReply; // Q도메인을 이용해서 reply의 객체를 생성
        JPQLQuery<QnaBoard> query = from(qnaBoard); // select * from board;
        query.leftJoin(qnaReply).on(qnaReply.qnaBoard.eq(qnaBoard)); // 두 테이블 간의 join 조건을 명시.
        // reply.board(board_bno) Reply 엔티티가 참조하고 있는 board의 외래키를 의미한다.
        // Reply 테이블의 board(외래키)와 Board 테이블의 기본키가 일치하는 경우에만 join 해라.
        // Board 테이블의 모든 데이터를 유지하면서 Reply 테이블의 조건에 따라 매칭되는 데이터를 가져와라.
        // 매칭이 되지 않은 경우에는 Reply 테이블의 값은 null로 반환되라.

        query.groupBy(qnaBoard);

        if ((types != null && types.length > 0) && keyword != null) {
            BooleanBuilder booleanBuilder = new BooleanBuilder();

            // 검색 조건 및 필터링
            for (String type : types) {
                switch (type) {
                    case "t":
                        booleanBuilder.or(qnaBoard.title.contains(keyword));
                        break;
                    case "c":
                        booleanBuilder.or(qnaBoard.content.contains(keyword));
                        break;
                    case "w":
                        booleanBuilder.or(qnaBoard.writer.contains(keyword));
                        break;
                }
            }
            query.where(booleanBuilder);
            // bno > 0
            query.where(qnaBoard.qno.gt(0L));
        }

        // 목록 화면에서 필요한 쿼리의 결과를 Projection.bean() 이라는 것을 이용해서 한번에 DTO로 처리할 수 있다.
        // 이것을 이용하려면 JPQLQuery객체의 select()를 이용해서 처리한다.
        JPQLQuery<QnaBoardReplyCountDTO> dtoQuery = query.select(Projections.bean(QnaBoardReplyCountDTO.class,
                qnaBoard.qno,
                qnaBoard.title,
                qnaBoard.writer,
                qnaBoard.createdAt,
                qnaReply.count().as("replyCount")));

        // 동적 쿼리 querydsl로 반환 값을 받기 위한 처리
        this.getQuerydsl().applyPagination(pageable, dtoQuery);
        List<QnaBoardReplyCountDTO> dtoList = dtoQuery.fetch(); // fetch() 쿼리 실행

        long count = dtoQuery.fetchCount();

        // 조회된 게시물의 목록과 페이징 정보를 사용해서 받기 위해서 PageImpl 사용
        return new PageImpl<>(dtoList, pageable, count);
        // 댓글 수를 고려해서 게시물 목록을 검색하고 검색 조건에 따라 결과를 필터링하고 페이징하여 반환하는 메서드
    }

    @Override
    public Page<QnaBoardListAllDTO> searchWithAll(String[] types, String keyword, Pageable pageable) {

        QQnaBoard qnaBoard = QQnaBoard.qnaBoard;
        QQnaReply qnaReply = QQnaReply.qnaReply;

        JPQLQuery<QnaBoard> boardJPQLQuery = from(qnaBoard);
        boardJPQLQuery.leftJoin(qnaReply).on(qnaReply.qnaBoard.eq(qnaBoard)); // left join

        if ((types != null && types.length > 0) && keyword != null) {
            BooleanBuilder booleanBuilder = new BooleanBuilder();

            // 검색 조건 및 필터링
            for (String type : types) {
                switch (type) {
                    case "t":
                        booleanBuilder.or(qnaBoard.title.contains(keyword));
                        break;
                    case "c":
                        booleanBuilder.or(qnaBoard.content.contains(keyword));
                        break;
                    case "w":
                        booleanBuilder.or(qnaBoard.writer.contains(keyword));
                        break;
                }
            }
            boardJPQLQuery.where(booleanBuilder);
        }


        boardJPQLQuery.groupBy(qnaBoard); // board를 기준으로 그룹핑.

        getQuerydsl().applyPagination(pageable, boardJPQLQuery); // paging

        // countDistinct : JPQL의 집계함수로 고유한 값의 개수를 세는 기능.
        // JPQLQuery<Tuple>를 생성하고 select() 메서드를 이용해서 Board 엔티티와 답변의 고유한 개수를 선태가형 쿼리로 반환.
        JPQLQuery<Tuple> tupleJPQLQuery = boardJPQLQuery.select(qnaBoard, qnaReply.countDistinct());
        // 반환한 결과를 list 타입으로 tupleList로 사용하겠다.
        List<Tuple> tupleList = tupleJPQLQuery.fetch();

        List<QnaBoardListAllDTO> dtoList = tupleList.stream().map(tuple -> {

            QnaBoard board1 = (QnaBoard) tuple.get(qnaBoard);
            long replyCount = tuple.get(1, Long.class);

            QnaBoardListAllDTO dto = QnaBoardListAllDTO.builder()
                    .qno(board1.getQno())
                    .title(board1.getTitle())
                    .writer(board1.getWriter())
                    .createdAt(board1.getCreatedAt())
                    .qnaReplyCount(replyCount)
                    .build();

            return dto;

        }).collect(Collectors.toList());

        long totalCount = boardJPQLQuery.fetchCount();

        return new PageImpl<>(dtoList, pageable, totalCount);
    }
}
