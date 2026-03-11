package com.example.skillswap.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "swapSession")
public class SwapSession {

    @Id
    private Long id;

    private Long mentorId;
    private Long studentId;

    private String skill;

    private LocalDateTime scheduledTime;

    private String status; // pending, active, completed

    private int tokenAmount;
}