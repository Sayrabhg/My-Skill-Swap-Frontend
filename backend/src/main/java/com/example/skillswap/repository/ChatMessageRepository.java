package com.example.skillswap.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.skillswap.model.ChatMessage;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    List<ChatMessage> findByRoomId(String roomId);
    void deleteByRoomId(String roomId);

}