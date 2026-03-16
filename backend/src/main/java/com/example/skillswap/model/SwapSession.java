package com.example.skillswap.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "swapSession")
public class SwapSession {

    @Id
    private String id;  // MongoDB ObjectId

    private String user1Id;   // First user
    private String user2Id;   // Second user

    private String skill;

    private LocalDateTime scheduledTime;

    private String status; // pending, active, completed

    private int tokenAmount;
}