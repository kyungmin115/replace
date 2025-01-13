package com.replace.controller.qna;

import com.replace.dto.PageRequestDTO;
import com.replace.dto.PageResponseDTO;
import com.replace.dto.qna.QnaReplyDTO;
import com.replace.service.qna.QnaReplyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/replies")
@Log4j2
@RequiredArgsConstructor
public class QnaReplyController {

    private final QnaReplyService qnaReplyService;

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Long> register(@Valid @RequestBody QnaReplyDTO qnaReplyDTO,
                                      BindingResult bindingResult)throws BindException {

        log.info(qnaReplyDTO);

        if(bindingResult.hasErrors()){
            throw new BindException(bindingResult);
        }

        Map<String, Long> resultMap = new HashMap<>();
        Long qrno = qnaReplyService.register(qnaReplyDTO);
        resultMap.put("qrno", qrno);

        return resultMap;
    }

    @GetMapping(value = "/list/{qno}")
    public PageResponseDTO<QnaReplyDTO> getList(@PathVariable("qno") Long qno,
                                     PageRequestDTO pageRequestDTO){

        PageResponseDTO<QnaReplyDTO> responseDTO = qnaReplyService.getListOfBoard(qno, pageRequestDTO);

        return responseDTO;
    }

    // 특정 댓글 삭제
    @DeleteMapping(value = "/{qrno}")
    public Map<String, Long> remove(@PathVariable("qrno") Long qrno){

        qnaReplyService.remove(qrno);

        Map<String, Long> resultMap = new HashMap<>();

            resultMap.put("qrno", qrno);

        return resultMap; // Modal 팝업창에 띄는 값을 위해
    }

    // 댓글 수정
    @PutMapping(value = "/{qrno}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Long> modify(@PathVariable("qrno") Long qrno, @RequestBody QnaReplyDTO qnaReplyDTO){

        qnaReplyDTO.setQrno(qrno); // 번호를 일치 시킴

        qnaReplyService.modify(qnaReplyDTO);

        Map<String, Long> resultMap = new HashMap<>();

        resultMap.put("qrno", qrno);

        return resultMap;
    }
}
