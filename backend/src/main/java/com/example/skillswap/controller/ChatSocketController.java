package com.example.skillswap.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.skillswap.model.ChatMessage;
import com.example.skillswap.service.ChatServiceImpl;

@Controller
public class ChatSocketController {

    @Autowired
    private ChatServiceImpl chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendMessage")
    public void sendMessage(ChatMessage message) {

        ChatMessage saved = chatService.sendMessage(
            message,
            message.getSenderId()
        );

        messagingTemplate.convertAndSend(
            "/topic/" + saved.getRoomId(),
            saved
        );
    }
}