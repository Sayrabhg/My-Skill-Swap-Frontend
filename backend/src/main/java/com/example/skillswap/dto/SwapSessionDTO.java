package com.example.skillswap.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class SwapSessionDTO {
    private String user1Id;
    private String user2Id;
    private String skill;
    private LocalDateTime scheduledTime;
    private int tokenAmount;
}