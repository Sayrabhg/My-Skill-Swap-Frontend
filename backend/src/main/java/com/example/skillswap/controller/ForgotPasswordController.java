package com.example.skillswap.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.skillswap.service.ForgotPasswordService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {

    @Autowired
    private ForgotPasswordService service;

    // 1️⃣ Generate OTP and send email (public)
    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> request){
        String email = request.get("email");
        service.generateAndSendOTP(email);
        return Map.of("message", "OTP sent to your email!");
    }

    // 2️⃣ Verify OTP (public)
    @PostMapping("/verify-otp")
    public Map<String, String> verifyOTP(@RequestBody Map<String, String> request){
        String email = request.get("email");
        String otp = request.get("otp");
        boolean valid = service.validateOTP(email, otp);
        return Map.of("message", valid ? "OTP verified" : "Invalid or expired OTP");
    }

    // 3️⃣ Reset password using OTP (public)
    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@RequestBody Map<String, String> request){
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");
        service.resetPassword(email, otp, newPassword);
        return Map.of("message", "Password reset successfully!");
    }
}