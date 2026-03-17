package com.example.skillswap.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

        // 1️⃣ Fetch the session
        SwapSession session = swapSessionService.getSessionById(room.getSwapSessionId());
        if (session == null) {
            return ResponseEntity.status(400).body("Swap session ID not found");
        }

        // 2️⃣ Check session status
        if (!"active".equalsIgnoreCase(session.getStatus())) {
            return ResponseEntity.status(400).body("First activate your swap session");
        }

        // 3️⃣ Use IDs directly (no email lookup)
        String user1Id = session.getUser1Id(); // learner ID
        String user2Id = session.getUser2Id(); // mentor ID

        // 4️⃣ Validate users match the session
        boolean validUsers =
                (user1Id.equals(room.getUserAId()) && user2Id.equals(room.getUserBId())) ||
                (user1Id.equals(room.getUserBId()) && user2Id.equals(room.getUserAId()));

        if (!validUsers) {
            return ResponseEntity.status(403).body("Users are not connected with this swap session");
        }

        // 5️⃣ Create room
        ChatRoom createdRoom = chatService.createRoom(
                room.getSwapSessionId(),
                room.getUserAId(),
                room.getUserBId()
        );

        return ResponseEntity.ok(createdRoom);
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
    
    
    
    @GetMapping("/chats/rooms")
    public ResponseEntity<List<ChatRoom>> getRoomsForUser(Authentication authentication) {

        // Logged-in user email from token
        String email = authentication.getName();

        // Convert email → userId
        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String userId = user.getId();

        // Get rooms for this user
        List<ChatRoom> rooms = chatService.getRoomsByUserId(userId);

        return ResponseEntity.ok(rooms);
    }
}