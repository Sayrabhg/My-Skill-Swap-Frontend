package com.example.skillswap.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import com.example.skillswap.model.ChatMessage;
import com.example.skillswap.model.ChatRoom;
import com.example.skillswap.model.SwapSession;
import com.example.skillswap.model.User;
import com.example.skillswap.service.ChatService;
import com.example.skillswap.service.ChatServiceImpl;
import com.example.skillswap.service.SwapSessionService;
import com.example.skillswap.service.UserService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin("*")
public class ChatController {

    @Autowired
    private ChatService chatService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ChatServiceImpl chatServiceImpl;
    
    @Autowired
    private SwapSessionService swapSessionService;

    // Create chat room
    @PostMapping("/create-room")
    public Object createRoom(@RequestBody ChatRoom room) {

        SwapSession session = swapSessionService.getSessionById(room.getSwapSessionId());

        if (session == null) {
            return "Swap session ID not found";
        }

        if (!"active".equalsIgnoreCase(session.getStatus())) {
            return "First activate your swap session";
        }

        // Convert user1 email → userId
        User user1 = userService.getUserByEmail(session.getUser1Id())
                .orElseThrow(() -> new RuntimeException("User1 not found"));

        String user1Id = user1.getId();
        String user2Id = session.getUser2Id();

        boolean validUsers =
                (user1Id.equals(room.getUserAId()) && user2Id.equals(room.getUserBId())) ||
                (user1Id.equals(room.getUserBId()) && user2Id.equals(room.getUserAId()));

        if (!validUsers) {
            return "Users are not connected with this swap session";
        }

        return chatService.createRoom(
                room.getSwapSessionId(),
                room.getUserAId(),
                room.getUserBId()
        );
    }

    // Get room by swap session
    @GetMapping("/room/{swapSessionId}")
    public ChatRoom getRoom(@PathVariable String swapSessionId) {

        return chatService.getRoomBySession(swapSessionId);
    }

    // Send message (secure)
    @PostMapping("/send")
    public ChatMessage sendMessage(
            @RequestBody ChatMessage message,
            Authentication authentication) {

        String email = authentication.getName(); // logged user email

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String loggedUserId = user.getId(); // MongoDB user ID

        return chatService.sendMessage(message, loggedUserId);
    }

    // Get messages
    @GetMapping("/messages/{roomId}")
    public List<ChatMessage> getMessages(@PathVariable String roomId) {

        return chatService.getMessages(roomId);
    }
    
    @GetMapping("/rooms")
    public List<ChatRoom> getAllRooms() {
        return chatServiceImpl.getAllRooms();
    }
    
    @DeleteMapping("/delete-room/{roomId}")
    public String deleteRoom(@PathVariable String roomId) {

        chatServiceImpl.deleteRoomWithMessages(roomId);

        return "Chat room and chat history deleted successfully";
    }
    
    @DeleteMapping("/delete/{chatId}")
    public String deleteMessage(
            @PathVariable String chatId,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean deleted = chatService.deleteMessage(chatId, user.getId());

        if (deleted) {
            return "Message deleted successfully";
        }

        return "Delete failed";
    }
}