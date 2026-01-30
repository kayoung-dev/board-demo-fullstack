package com.camp.backend.dto;

import com.camp.backend.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BoardResponse {

    private Long id;
    private String title;
    private String content;
    private String writer;

    public static BoardResponse from(Board board) {
        return new BoardResponse(
                board.getId(),
                board.getTitle(),
                board.getContent(),
                board.getWriter()
        );
    }
}