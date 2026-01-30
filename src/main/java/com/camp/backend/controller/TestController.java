package com.camp.backend.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {
    @GetMapping("/test")
    public Map<String, Object> test() {
        return Map.of(
                "id", 1,
                "title", "첫 연결 테스트",
                "content", "Spring Boot에서 보낸 JSON 데이터입니다"
        );
    }
}

