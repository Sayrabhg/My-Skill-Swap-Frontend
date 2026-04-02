package com.example.skillswap.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.skillswap.model.OTP;

public interface OTPRepository extends MongoRepository<OTP, String> {
    Optional<OTP> findByUserId(String userId);
    Optional<OTP> findByOtp(String otp);
}