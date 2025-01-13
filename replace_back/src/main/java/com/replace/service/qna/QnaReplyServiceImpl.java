package com.replace.service.qna;

import com.replace.domain.qna.QnaBoard;
import com.replace.domain.qna.QnaReply;
import com.replace.domain.qna.QnaReplyStatus;
import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;
import com.replace.dto.qna.QnaReplyDTO;
import com.replace.repository.qna.QnaBoardRepository;
import com.replace.repository.qna.QnaReplyRepository;
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
@RequiredArgsConstructor
@Log4j2
public class QnaReplyServiceImpl implements QnaReplyService {

    private final QnaReplyRepository qnaReplyRepository;
    private final QnaBoardRepository qnaBoardRepository;
    private final ModelMapper modelMapper;

    @Override
    public Long register(QnaReplyDTO qnaReplyDTO){

        QnaReply qnaReply = modelMapper.map(qnaReplyDTO, QnaReply.class);

        // 댓글 저장
        Long qrno = qnaReplyRepository.save(qnaReply).getQrno();

        // 댓글 상태 업데이트
        updateReplyStatus(qnaReply.getQnaBoard().getQno());

        return qrno;
    }
    @Override
    public QnaReplyDTO read(Long qrno){
        Optional<QnaReply> replyOptional = qnaReplyRepository.findById(qrno);

        QnaReply qnaReply = replyOptional.orElseThrow();

        return modelMapper.map(qnaReply, QnaReplyDTO.class);
    }

    @Override
    public void modify(QnaReplyDTO qnaReplyDTO){
        Optional<QnaReply> replyOptional = qnaReplyRepository.findById(qnaReplyDTO.getQrno());

        QnaReply qnaReply = replyOptional.orElseThrow();

        qnaReply.changeText(qnaReplyDTO.getReplyText());// 댓글의 내용만 수정 가능

        qnaReplyRepository.save(qnaReply);
    }

    @Override
    public void remove(Long qrno){

        Optional<QnaReply> replyOptional = qnaReplyRepository.findById(qrno);

        QnaReply qnaReply = replyOptional.orElseThrow();

        Long qno = qnaReply.getQnaBoard().getQno(); // 댓글이 속한 게시글 ID 가져오기

        // 댓글 삭제
        qnaReplyRepository.deleteById(qrno);

        // 댓글 상태 업데이트
        updateReplyStatus(qno);
    }

    @Override // 특정 게시물의 댓글 목록을 페이징 처리해서 조회
    public PageResponseDTO<QnaReplyDTO> getListOfBoard(Long qno, PageRequestDTO pageRequestDTO){

        Pageable pageable =
                PageRequest.of(pageRequestDTO.getPage() <=0? 0: pageRequestDTO.getPage() -1,
                        pageRequestDTO.getSize(),
                        Sort.by("qrno").descending());

        Page<QnaReply> result = qnaReplyRepository.listOfBoard(qno, pageable);

        List<QnaReplyDTO> dtoList = result.getContent().stream().map(reply ->
                        modelMapper.map(reply, QnaReplyDTO.class))
                .collect(Collectors.toList());

        return PageResponseDTO.<QnaReplyDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .dtoList(dtoList)
                .totalCount((int)result.getTotalElements())
                .build();
    }

    // 댓글 상태 업데이트
    private void updateReplyStatus(Long qno){
        QnaBoard qnaBoard = qnaBoardRepository.findById(qno)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        long replyCount = qnaReplyRepository.countByQnaBoard(qnaBoard);

        if (replyCount > 0) {
            qnaBoard.updateQnaReplyStatus(QnaReplyStatus.COMPLETED);
        } else {
            qnaBoard.updateQnaReplyStatus(QnaReplyStatus.WAITING);
        }

        qnaBoardRepository.save(qnaBoard);

    }
}
