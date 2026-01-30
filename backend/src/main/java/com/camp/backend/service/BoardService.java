package com.camp.backend.service;


import com.camp.backend.dto.BoardRequest;
import com.camp.backend.dto.BoardResponse;
import com.camp.backend.entity.Board;
import com.camp.backend.exception.NotFoundException;
import com.camp.backend.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;

    public Page<BoardResponse> getBoards(String keyword, Pageable pageable) {
        Page<Board> boards = (keyword == null || keyword.isBlank())
                ? boardRepository.findAll(pageable)
                : boardRepository.findByTitleContainingIgnoreCase(keyword, pageable);

        return boards.map(BoardResponse::from);
    }

    public BoardResponse getBoard(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("게시글이 존재하지 않습니다"));
        return BoardResponse.from(board);
    }

    public BoardResponse create(BoardRequest request) {
        Board board = Board.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .writer(request.getWriter())
                .build();

        return BoardResponse.from(boardRepository.save(board));
    }

    public BoardResponse update(Long id, BoardRequest request) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("게시글이 존재하지 않습니다"));

        board = Board.builder()
                .id(board.getId())
                .title(request.getTitle())
                .content(request.getContent())
                .writer(request.getWriter())
                .build();

        return BoardResponse.from(boardRepository.save(board));
    }

    public void delete(Long id) {
        boardRepository.deleteById(id);
    }
}
