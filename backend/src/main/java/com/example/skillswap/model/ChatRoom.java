package com.example.skillswap.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "chat_rooms")
public class ChatRoom {

    @Id
    private String id;

    private String userAId; // sender (request initiator)
    private String userBId; // receiver

    private String status; 
    // PENDING → when A sends request
    // ACCEPTED → when B accepts
    // REJECTED → when B rejects
}