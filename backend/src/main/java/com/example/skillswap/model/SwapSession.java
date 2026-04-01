package com.example.skillswap.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "swapSession")

// ✅ THIS LINE IS VERY IMPORTANT
@CompoundIndex(def = "{'user1Id': 1, 'user2Id': 1}", unique = true)

public class SwapSession {

    @Id
    private String id;

    private String user1Id;
    private String user2Id;

    private String skill;

    private LocalDateTime scheduledTime;

    private String status; // pending, active, completed

    private int tokenAmount;
}