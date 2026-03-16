package com.example.skillswap.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.skillswap.model.ChatMessage;
import com.example.skillswap.model.ChatRoom;
import com.example.skillswap.model.SwapSession;
import com.example.skillswap.repository.ChatMessageRepository;
import com.example.skillswap.repository.ChatRoomRepository;
import com.example.skillswap.repository.SwapSessionRepository;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRoomRepository chatRoomRepo;

    @Autowired
    private ChatMessageRepository chatMessageRepo;

    @Autowired
    private SwapSessionRepository swapSessionRepo; // ✅ Added

    @Override
    public ChatRoom createRoom(String swapSessionId, String userAId, String userBId) {

        Optional<ChatRoom> existing = chatRoomRepo.findBySwapSessionId(swapSessionId);

        if (existing.isPresent()) {
            return existing.get();
        }

        ChatRoom room = new ChatRoom();
        room.setSwapSessionId(swapSessionId);
        room.setUserAId(userAId);
        room.setUserBId(userBId);

        return chatRoomRepo.save(room);
    }

    @Override
    public ChatRoom getRoomBySession(String swapSessionId) {

        return chatRoomRepo.findBySwapSessionId(swapSessionId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
    }

    @Override
    public ChatMessage sendMessage(ChatMessage message, String loggedUserId) {

        // 1️⃣ Get chat room
        ChatRoom room = chatRoomRepo.findById(message.getRoomId())
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        // 2️⃣ Check if logged user belongs to this room
        if (!room.getUserAId().equals(loggedUserId) &&
            !room.getUserBId().equals(loggedUserId)) {

            throw new RuntimeException("Unauthorized: You are not part of this chat");
        }

        // 3️⃣ Check swap session
        SwapSession session = swapSessionRepo
                .findById(room.getSwapSessionId())
                .orElseThrow(() -> new RuntimeException("Swap session not found"));

        // 4️⃣ Allow chat only when session active
        if (!"active".equalsIgnoreCase(session.getStatus())) {
            throw new RuntimeException("Chat allowed only for active sessions");
        }

        // 5️⃣ Force senderId (do NOT trust frontend)
        message.setSenderId(loggedUserId);

        // 6️⃣ Save message
        return chatMessageRepo.save(message);
    }

    @Override
    public List<ChatMessage> getMessages(String roomId) {

        return chatMessageRepo.findByRoomId(roomId);
    }
    
    @Override
    public boolean deleteMessage(String chatId, String loggedUserId) {

        ChatMessage message = chatMessageRepo.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Only sender can delete the message
        if (!message.getSenderId().equals(loggedUserId)) {
            throw new RuntimeException("Unauthorized to delete this message");
        }

        chatMessageRepo.deleteById(chatId);

        return true;
    }
    
    public List<ChatRoom> getAllRooms() {
        return chatRoomRepo.findAll();
    }
    
    public void deleteRoomWithMessages(String roomId) {

        // delete all messages of this room
        chatMessageRepo.deleteByRoomId(roomId);

        // delete chat room
        chatRoomRepo.deleteById(roomId);
    }
}