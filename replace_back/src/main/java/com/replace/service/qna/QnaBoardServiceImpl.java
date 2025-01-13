package com.replace.service.qna;

import com.replace.domain.qna.QnaBoard;
import com.replace.domain.qna.QnaReplyStatus;
import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;
import com.replace.dto.qna.QnaBoardDTO;
import com.replace.dto.qna.QnaBoardListAllDTO;
import com.replace.dto.qna.QnaBoardReplyCountDTO;
import com.replace.repository.qna.QnaBoardRepository;
import com.replace.repository.qna.QnaReplyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class QnaBoardServiceImpl implements QnaBoardService {

    private final ModelMapper modelMapper;
    private final QnaBoardRepository qnaBoardRepository;
    private final QnaReplyRepository qnaReplyRepository;

    @Override
    public Long register(QnaBoardDTO qnaBoardDTO) {

        QnaBoard qnaBoard = dtoToEntity(qnaBoardDTO);

        Long qno = qnaBoardRepository.save(qnaBoard).getQno();

        return qno;
    }

    @Override
    public QnaBoardDTO readOne(Long qno) {

        Optional<QnaBoard> result = qnaBoardRepository.findById(qno);

        QnaBoard qnaBoard = result.orElseThrow();

        // 쿼리문에 직접 접근하지 않는다.
        QnaBoardDTO qnaBoardDTO = entityToDTO(qnaBoard);

        return qnaBoardDTO;
    }

    @Override
    public void modify(QnaBoardDTO qnaBoardDTO) {

        Optional<QnaBoard> result = qnaBoardRepository.findById(qnaBoardDTO.getQno());

        QnaBoard qnaBoard = result.orElseThrow(() ->
                new RuntimeException("QnaBoard not found with qno: " + qnaBoardDTO.getQno())
        );

        qnaBoard.change(
                qnaBoardDTO.getTitle(),
                qnaBoardDTO.getContent(),
                qnaBoardDTO.isNotice(),
                qnaBoardDTO.isSecret()
        );

        qnaBoardRepository.save(qnaBoard);
    }

    @Override
    public void remove(Long qno) {

        // 게시글과 연결된 댓글 삭제
        qnaReplyRepository.deleteByQnaBoard_qno(qno);

        // 게시글 삭제
        qnaBoardRepository.deleteById(qno);

    }


    @Override
    public PageResponseDTO<QnaBoardDTO> list(PageRequestDTO pageRequestDTO) {

        // list를 페이징 처리해서 응답받기 위한 조건들
        String[] types = pageRequestDTO.getTypes(); // ["tc"]가 들어왔다면 ["t","c"]로 나눠진다.
        String keyword = pageRequestDTO.getKeyword();

            Pageable pageable =
                    PageRequest.of(
                            pageRequestDTO.getPage() - 1 ,  // 1페이지가 0이므로 주의
                            pageRequestDTO.getSize(),
                            Sort.by("qno").descending());

            // 전체 게시글 조회
            Page<QnaBoard> result = qnaBoardRepository.findAll(pageable);

        // DTO 리스트 생성 (댓글 상태 추가)
        List<QnaBoardDTO> dtoList = result.getContent().stream()
                .map(qna -> {
                    QnaBoardDTO dto = modelMapper.map(qna, QnaBoardDTO.class);

                    // 댓글 상태 계산
                    long replyCount = qnaReplyRepository.countByQnaBoard(qna);
                    dto.setQnaReplyStatus(replyCount > 0 ? QnaReplyStatus.COMPLETED : QnaReplyStatus.WAITING);

                    return dto;
                })
                .collect(Collectors.toList());

            long totalCount = result.getTotalElements();

            // DB에서 찾아서 원소 값을 받아온다.
            Page<QnaBoard> searchResult = qnaBoardRepository.searAll(types, keyword, pageable);

            PageResponseDTO<QnaBoardDTO> responseDTO = PageResponseDTO.<QnaBoardDTO>withAll()
                    .dtoList(dtoList)
                    .pageRequestDTO(pageRequestDTO)
                    .totalCount(totalCount)
                    .build();

            return responseDTO;
    }

    @Override
    public PageResponseDTO<QnaBoardReplyCountDTO> listWithReplyCount(PageRequestDTO pageRequestDTO) {

        String[] types = pageRequestDTO.getTypes();
        String keyword = pageRequestDTO.getKeyword();
        Pageable pageable = pageRequestDTO.getPageable("qno");

        Page<QnaBoardReplyCountDTO> result = qnaBoardRepository.searchWithReplyCount(types, keyword, pageable);

        return PageResponseDTO.<QnaBoardReplyCountDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .dtoList(result.getContent())
                .totalCount((int)result.getTotalElements())
                .build();
    }

    @Override
    public PageResponseDTO<QnaBoardListAllDTO> listWithAll(PageRequestDTO pageRequestDTO) {

        String[] types = pageRequestDTO.getTypes();
        String keyword = pageRequestDTO.getKeyword();
        Pageable pageable = pageRequestDTO.getPageable("qno");

        Page<QnaBoardListAllDTO> result = qnaBoardRepository.searchWithAll(types, keyword, pageable);

        return PageResponseDTO.<QnaBoardListAllDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .dtoList(result.getContent())
                .totalCount((int)result.getTotalElements())
                .build();

    }
}
