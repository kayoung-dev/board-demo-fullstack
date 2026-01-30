package com.camp.backend.controller;


import com.camp.backend.dto.BoardRequest;
import com.camp.backend.dto.BoardResponse;
import com.camp.backend.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping
    /*
    GET /boards?keyword=spring&page=0&size=5&sort=id,desc // 검색+페이징 같이
    GET /boards?sort=createdAt,desc&sort=id,asc // 정렬 변경
    GET /boards?page=0&size=10 // 페이지 크기 변경

    *
    * */
    public Page<BoardResponse> list(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 5, sort = "id") Pageable pageable) {
        return boardService.getBoards(keyword, pageable);
    }

    @GetMapping("/{id}")
    public BoardResponse get(@PathVariable Long id) {
        return boardService.getBoard(id);
    }

    @PostMapping
    public BoardResponse create(@Valid @RequestBody BoardRequest request) {
        return boardService.create(request);
    }

    @PutMapping("/{id}")
    public BoardResponse update(
            @PathVariable Long id,
            @Valid @RequestBody BoardRequest request) {
        return boardService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        boardService.delete(id);
    }
}