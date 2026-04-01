package com.example.skillswap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomDTO {

    private String roomId;
    private String status;
    private String otherUserId;
    private String otherUserName;

    private String lastMessage;
    private String time;
}