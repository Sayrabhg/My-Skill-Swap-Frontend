package com.example.skillswap.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "otps")
public class OTP {
    @Id
    private String id;

    private String otp;
    private LocalDateTime expiryTime;
    private String userId; // Reference to User
}