package com.example.skillswap.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.skillswap.dto.LoginRequest;
import com.example.skillswap.dto.RoleLoginResponse;
import com.example.skillswap.dto.SignupRequest;
import com.example.skillswap.dto.SignupResponse;
import com.example.skillswap.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ----------------- SIGNUP -----------------
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        SignupResponse response = authService.signup(request);
       
        if (!response.isSuccess()) {
            return ResponseEntity.status(400).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    // ----------------- LOGIN -----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        // Directly use AuthService to validate email/password and generate token
        RoleLoginResponse response = authService.login(request);

        if(response.getToken() == null) {
            return ResponseEntity.status(401).body(response.getMessage());
        }

        return ResponseEntity.ok(response);
    }

}