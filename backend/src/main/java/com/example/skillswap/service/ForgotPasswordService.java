package com.example.skillswap.service;

import org.springframework.stereotype.Service;

import com.example.skillswap.model.OTP;
import com.example.skillswap.model.User;
import com.example.skillswap.repository.OTPRepository;
import com.example.skillswap.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class ForgotPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OTPRepository otpRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Generate OTP and send email
    public void generateAndSendOTP(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.format("%06d", new Random().nextInt(999999));
        OTP otpEntity = otpRepository.findByUserId(user.getId()).orElse(new OTP());
        otpEntity.setOtp(otp);
        otpEntity.setUserId(user.getId());
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otpEntity);

        // Send OTP via email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Your OTP for Password Reset");
        message.setText("Your OTP is: " + otp + "\nIt is valid for 5 minutes.");
        mailSender.send(message);
    }

    // Validate OTP
    public boolean validateOTP(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        OTP otpEntity = otpRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        return otpEntity.getOtp().equals(otp) && otpEntity.getExpiryTime().isAfter(LocalDateTime.now());
    }

    // Reset password with hashing
    public void resetPassword(String email, String otp, String newPassword) {
        // 1. Validate OTP
        if (!validateOTP(email, otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        // 2. Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Hash new password before saving
        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);
        userRepository.save(user);

        // 4. Delete OTP after successful reset
        OTP otpEntity = otpRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("OTP not found"));
        otpRepository.delete(otpEntity);
    }
}