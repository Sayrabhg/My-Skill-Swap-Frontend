package com.example.skillswap.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDate;

@Data
@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;

    private String roomId;
    private String senderId;
    private String message;

    private LocalDate date; // listener will set this
    private String time;    // listener will set this

    // Empty constructor is enough; listener will handle timestamps
    public ChatMessage() {}

    // Optional convenience constructor
    public ChatMessage(String roomId, String senderId, String message) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.message = message;
    }
}