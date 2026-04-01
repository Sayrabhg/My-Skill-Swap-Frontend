package com.example.skillswap.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;

    private String roomId;
    private String senderId;
    private String message;

    private LocalDate date; // server sets (IST)
    private String time;    // server sets (HH:mm)

    // 🔥 NEW FIELDS (IMPORTANT)

    // ✅ For "Delete for everyone"
    private boolean deletedForEveryone = false;

    // ✅ For "Delete for me"
    private List<String> deletedForUsers = new ArrayList<>();

    public ChatMessage() {}

    public ChatMessage(String roomId, String senderId, String message) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.message = message;
    }
}