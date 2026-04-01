package com.example.skillswap.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import com.example.skillswap.dto.ChatRoomDTO;
import com.example.skillswap.model.ChatMessage;
import com.example.skillswap.model.ChatRoom;
import com.example.skillswap.model.User;
import com.example.skillswap.service.ChatService;
import com.example.skillswap.service.ChatServiceImpl;
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

    // ✅ SEND REQUEST (UserA → UserB)
    @PostMapping("/create-room")
    public ResponseEntity<ChatRoom> sendRequest(
            @RequestParam String userBId,
            Authentication authentication) {

        String email = authentication.getName();

        User userA = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ChatRoom room = chatService.createRoom(userA.getId(), userBId);

        return ResponseEntity.ok(room);
    }

    // ✅ ACCEPT REQUEST
    @PutMapping("/accept/{roomId}")
    public ResponseEntity<ChatRoom> acceptRequest(@PathVariable String roomId) {

        return ResponseEntity.ok(chatService.acceptRequest(roomId));
    }

    // ✅ REJECT REQUEST
    @PutMapping("/reject/{roomId}")
    public ResponseEntity<ChatRoom> rejectRequest(@PathVariable String roomId) {

        return ResponseEntity.ok(chatService.rejectRequest(roomId));
    }

    // ✅ GET PENDING REQUESTS (for logged user)
    @GetMapping("/pending")
    public ResponseEntity<List<ChatRoom>> getPendingRequests(Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(chatService.getPendingRequests(user.getId()));
    }

    // ✅ GET ACCEPTED CHAT ROOMS
    @GetMapping("/last-message")
    public ResponseEntity<List<ChatRoomDTO>> getUserChatRooms(Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                chatServiceImpl.getUserChatRoomsWithLastMessage(user.getId())
        );
    }

    // ✅ GET MESSAGES
    @GetMapping("/messages/{roomId}")
    public List<ChatMessage> getMessages(@PathVariable String roomId) {
        return chatService.getMessages(roomId);
    }

    // ✅ SEND MESSAGE (SECURE)
    @PostMapping("/send")
    public ChatMessage sendMessage(
            @RequestBody ChatMessage message,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return chatService.sendMessage(message, user.getId());
    }

    // ✅ DELETE MESSAGE
    @DeleteMapping("/delete/me/{chatId}")
    public ResponseEntity<?> deleteForMe(
            @PathVariable String chatId,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean deleted = chatService.deleteForMe(chatId, user.getId());

        if (deleted) {
            return ResponseEntity.ok("Deleted for me ✅");
        } else {
            return ResponseEntity.status(403).body("Delete failed ❌");
        }
    }
    
    @DeleteMapping("/delete/everyone/{chatId}")
    public ResponseEntity<?> deleteForEveryone(
            @PathVariable String chatId,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean deleted = chatService.deleteForEveryone(chatId, user.getId());

        if (deleted) {
            return ResponseEntity.ok("Deleted for everyone ✅");
        } else {
            return ResponseEntity.status(403).body("Delete failed ❌");
        }
    }

    // ✅ ADMIN / DEBUG
    @GetMapping("/all-rooms")
    public List<ChatRoom> getAllRooms() {
        return chatServiceImpl.getAllRooms();
    }
    
 // ✅ PERFECT API: Get MY accepted chat rooms with roomId
    @GetMapping("/my-chat-rooms")
    public ResponseEntity<List<ChatRoomDTO>> getMyAcceptedChatRooms(Authentication authentication) {
        String email = authentication.getName();
        
        User currentUser = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<ChatRoomDTO> myRooms = chatServiceImpl.getMyAcceptedChatRooms(currentUser.getId());
        
        return ResponseEntity.ok(myRooms);
    }
    
 // YOUR CONTROLLER IS PERFECT - NO CHANGES!
    @GetMapping("/my-users")
    public ResponseEntity<?> getMyConnections(Authentication authentication) {
        String email = authentication.getName();
        List<User> users = chatService.getConnectedUsers(email); // ✅ WORKS NOW
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/delete-room/{roomId}")
    public String deleteRoom(@PathVariable String roomId) {

        chatServiceImpl.deleteRoomWithMessages(roomId);

        return "Chat room and chat history deleted successfully";
    }
}