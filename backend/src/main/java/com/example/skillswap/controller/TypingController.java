package com.example.skillswap.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import com.example.skillswap.dto.DeleteResponse;
import com.example.skillswap.dto.SocketDeleteRequest;
import com.example.skillswap.dto.TypingMessage;
import com.example.skillswap.model.User;
import com.example.skillswap.service.ChatServiceImpl;
import com.example.skillswap.service.UserService;

@Controller
public class TypingController {

	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@Autowired
	private UserService userService;

	@Autowired
	private ChatServiceImpl chatService;
	
	@MessageMapping("/typing")
	public void handleTyping(TypingMessage message) {
	    messagingTemplate.convertAndSend(
	        "/topic/typing/" + message.getRoomId(),
	        message
	    );
	}
	
	@MessageMapping("/deleteMessage")
	public void deleteMessage(SocketDeleteRequest request, Authentication authentication) {

	    String email = authentication.getName(); // ✅ NOW WORKS

	    User user = userService.getUserByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    boolean deleted;

	    if ("everyone".equals(request.getType())) {
	        deleted = chatService.deleteForEveryone(request.getChatId(), user.getId());
	    } else {
	        deleted = chatService.deleteForMe(request.getChatId(), user.getId());
	    }

	    if (deleted) {
	        messagingTemplate.convertAndSend(
	                "/topic/delete/" + request.getRoomId(),
	                new DeleteResponse(request.getChatId(), request.getType(), user.getId())
	        );
	    }
	}
}