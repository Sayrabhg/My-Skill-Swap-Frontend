package com.example.skillswap.service;

import java.util.List;

import com.example.skillswap.model.ChatMessage;
import com.example.skillswap.model.ChatRoom;
import com.example.skillswap.model.User;

public interface ChatService {
    ChatRoom createRoom(String userAId, String userBId);
    ChatRoom getRoom(String userAId, String userBId);
    
    ChatRoom acceptRequest(String roomId);
    ChatRoom rejectRequest(String roomId);
    
    List<ChatRoom> getPendingRequests(String userId);
    List<ChatRoom> getUserChatRooms(String userId);
    
    ChatMessage sendMessage(ChatMessage message, String loggedUserId);
    ChatMessage saveMessage(ChatMessage msg);
    List<ChatMessage> getMessages(String roomId);
    
    boolean deleteMessage(String chatId, String loggedUserId);
    
    // ✅ ADD THIS METHOD
    List<User> getConnectedUsers(String email);
	boolean deleteForEveryone(String chatId, String userId);
	boolean deleteForMe(String chatId, String userId);
	List<ChatRoom> getCheckedRequests(String userId);
}