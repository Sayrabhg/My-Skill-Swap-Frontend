package com.example.skillswap.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

	// ----------------- TEST ENDPOINT -----------------
    @GetMapping("/")
    public ResponseEntity<String> getData() {
        return ResponseEntity.ok("Backend Skill Swap API is Running...");
    }
}
