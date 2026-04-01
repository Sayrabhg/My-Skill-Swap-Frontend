package com.example.skillswap.dto;

import lombok.Data;

@Data
public class SocketDeleteRequest {
    private String chatId;
    private String roomId;
    private String type; // "everyone" or "me"
}
