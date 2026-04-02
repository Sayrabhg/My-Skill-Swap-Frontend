package com.example.skillswap.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.skillswap.dto.ChatRoomDTO;
import com.example.skillswap.model.ChatMessage;
import com.example.skillswap.model.ChatRoom;
import com.example.skillswap.model.User;
import com.example.skillswap.repository.ChatMessageRepository;
import com.example.skillswap.repository.ChatRoomRepository;
import com.example.skillswap.repository.UserRepository;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRoomRepository chatRoomRepo;

    @Autowired
    private ChatMessageRepository chatMessageRepo;
    
    @Autowired
    private UserRepository userRepo;

    public List<ChatRoomDTO> getUserChatRoomsWithLastMessage(String userId) {

        List<ChatRoom> rooms = chatRoomRepo.findAll()
                .stream()
                .filter(r ->
                        (r.getUserAId().equals(userId) || r.getUserBId().equals(userId))
                                && "ACCEPTED".equalsIgnoreCase(r.getStatus())
                )
                .toList();

        return rooms.stream().map(room -> {

            ChatRoomDTO dto = new ChatRoomDTO();
            dto.setRoomId(room.getId());

            // ✅ Find other user
            String otherUserId = room.getUserAId().equals(userId)
                    ? room.getUserBId()
                    : room.getUserAId();

            dto.setOtherUserId(otherUserId);

            // ✅ Get user name
            User otherUser = userRepo.findById(otherUserId).orElse(null);
            dto.setOtherUserName(
                    otherUser != null ? otherUser.getName() : "User"
            );

            // ✅ Get last message
            ChatMessage lastMsg = chatMessageRepo
                    .findTopByRoomIdOrderByDateDescTimeDesc(room.getId());

            if (lastMsg != null) {
                dto.setLastMessage(lastMsg.getMessage());
                dto.setTime(lastMsg.getTime());
            } else {
                dto.setLastMessage("Start conversation");
                dto.setTime("");
            }

            return dto;

        }).toList();
    }

    // ✅ CREATE ROOM
    @Override
    public ChatRoom createRoom(String userAId, String userBId) {

        Optional<ChatRoom> chat1 = chatRoomRepo.findByUserAIdAndUserBId(userAId, userBId);
        Optional<ChatRoom> chat2 = chatRoomRepo.findByUserBIdAndUserAId(userAId, userBId);

        if (chat1.isPresent()) return chat1.get();
        if (chat2.isPresent()) return chat2.get();

        ChatRoom room = new ChatRoom();
        room.setUserAId(userAId);
        room.setUserBId(userBId);
        room.setStatus("PENDING");

        return chatRoomRepo.save(room);
    }

    // ✅ GET ROOM
    @Override
    public ChatRoom getRoom(String userAId, String userBId) {
        return chatRoomRepo.findByUserAIdAndUserBId(userAId, userBId)
                .or(() -> chatRoomRepo.findByUserBIdAndUserAId(userAId, userBId))
                .orElseThrow(() -> new RuntimeException("Chat room not found"));
    }

    // ✅ ACCEPT
    @Override
    public ChatRoom acceptRequest(String roomId) {

        ChatRoom room = chatRoomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setStatus("ACCEPTED");
        return chatRoomRepo.save(room);
    }

    // ✅ REJECT
    @Override
    public ChatRoom rejectRequest(String roomId) {

        ChatRoom room = chatRoomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setStatus("REJECTED");
        return chatRoomRepo.save(room);
    }

    // ✅ PENDING REQUESTS
    @Override
    public List<ChatRoom> getPendingRequests(String userId) {
        return chatRoomRepo.findByUserBIdAndStatus(userId, "PENDING");
    }

    // ✅ PENDING REQUESTS
    @Override
    public List<ChatRoom> getCheckedRequests(String userId) {
        return chatRoomRepo.findByUserBIdAndStatusIn(
            userId,
            List.of("ACCEPTED", "REJECTED")
        );
    }

    // ✅ ACCEPTED ROOMS
    @Override
    public List<ChatRoom> getUserChatRooms(String userId) {

        return chatRoomRepo.findAll()
                .stream()
                .filter(r ->
                        (r.getUserAId().equals(userId) || r.getUserBId().equals(userId))
                                && "ACCEPTED".equalsIgnoreCase(r.getStatus())
                )
                .collect(Collectors.toList());
    }

    // ✅ SEND MESSAGE (MAIN LOGIC)
    @Override
    public ChatMessage sendMessage(ChatMessage message, String loggedUserId) {

        ChatRoom room = chatRoomRepo.findById(message.getRoomId())
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        // 🔐 Security check
        if (!room.getUserAId().equals(loggedUserId) &&
            !room.getUserBId().equals(loggedUserId)) {
            throw new RuntimeException("Unauthorized");
        }

        // ❌ Block if not accepted
        if (!"ACCEPTED".equalsIgnoreCase(room.getStatus())) {
            throw new RuntimeException("Chat not allowed until request is accepted");
        }

        // ✅ Set sender
        message.setSenderId(loggedUserId);

        // ✅ IST TIME
        ZoneId ist = ZoneId.of("Asia/Kolkata");

        message.setDate(LocalDate.now(ist));
        message.setTime(LocalTime.now(ist)
                .format(DateTimeFormatter.ofPattern("HH:mm")));

        return chatMessageRepo.save(message);
    }

    // ✅ GET MESSAGES
    @Override
    public List<ChatMessage> getMessages(String roomId) {
        return chatMessageRepo.findByRoomId(roomId);
    }

    // ✅ DELETE MESSAGE
//    @Override
//    public boolean deleteMessage(String chatId, String loggedUserId) {
//
//        ChatMessage message = chatMessageRepo.findById(chatId)
//                .orElseThrow(() -> new RuntimeException("Message not found"));
//
//        if (!message.getSenderId().equals(loggedUserId)) {
//            throw new RuntimeException("Unauthorized");
//        }
//
//        chatMessageRepo.deleteById(chatId);
//        return true;
//    }

    // ✅ SAVE (OPTIONAL)
    @Override
    public ChatMessage saveMessage(ChatMessage msg) {
        return chatMessageRepo.save(msg);
    }

    // ✅ ADMIN
    public List<ChatRoom> getAllRooms() {
        return chatRoomRepo.findAll();
    }

    public void deleteRoomWithMessages(String roomId) {
        chatMessageRepo.deleteByRoomId(roomId);
        chatRoomRepo.deleteById(roomId);
    }
    // ✅ FIXED: getConnectedUsers WITH HashSet DEDUPLICATION
    @Override
    public List<User> getConnectedUsers(String email) {
        User currentUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String currentUserId = currentUser.getId();
        List<ChatRoom> rooms = chatRoomRepo.findUserConnections(currentUserId, "ACCEPTED");

        // ✅ HashSet AUTOMATICALLY removes duplicates
        Set<String> connectedUserIds = new HashSet<>();
        
        for (ChatRoom room : rooms) {
            String otherUserId = room.getUserAId().equals(currentUserId) 
                ? room.getUserBId() 
                : room.getUserAId();
            
            connectedUserIds.add(otherUserId);
        }

        // ✅ Convert to List<User>
        return connectedUserIds.stream()
                .map(userRepo::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

 // ✅ NEW METHOD: Get logged user's ACCEPTED chat rooms with roomId
    public List<ChatRoomDTO> getMyAcceptedChatRooms(String userId) {
        List<ChatRoom> allRooms = chatRoomRepo.findUserConnections(userId, "ACCEPTED");
        
        return allRooms.stream()
                .map(room -> {
                	ChatRoomDTO response = new ChatRoomDTO();
                    response.setRoomId(room.getId());
                    response.setStatus(room.getStatus());
                    
                    // Set other user info
                    String otherUserId = room.getUserAId().equals(userId) 
                        ? room.getUserBId() 
                        : room.getUserAId();
                    
                    User otherUser = userRepo.findById(otherUserId).orElse(null);
                    response.setOtherUserId(otherUserId);
                    response.setOtherUserName(otherUser != null ? otherUser.getName() : "Unknown");
                    
                    return response;
                })
                .distinct() // Remove duplicates if any
                .collect(Collectors.toList());
    }
    
    @Override
    public boolean deleteMessage(String chatId, String loggedUserId) {

        System.out.println("🗑️ Trying to delete the message: " + chatId);

        return chatMessageRepo.findById(chatId)
                .map(chat -> {

                    // ✅ सुरक्षा: Only sender can delete
                    if (!chat.getSenderId().equals(loggedUserId)) {
                        System.out.println("❌ Not authorized to delete");
                        return false;
                    }

                    // ✅ DELETE FROM DB
                    chatMessageRepo.deleteById(chatId);

                    System.out.println("✅ Message deleted from DB");

                    return true;
                })
                .orElseGet(() -> {
                    System.out.println("❌ Message not found");
                    return false;
                });
    }
    
    @Override
    public boolean deleteForEveryone(String chatId, String userId) {

        return chatMessageRepo.findById(chatId)
                .map(chat -> {

                    // ✅ Only sender can delete
                    if (!chat.getSenderId().equals(userId)) {
                        return false;
                    }

                    chat.setDeletedForEveryone(true);
                    chat.setMessage("This message was deleted");

                    chatMessageRepo.save(chat);

                    return true;
                })
                .orElse(false);
    }
    
    @Override
    public boolean deleteForMe(String chatId, String userId) {

        return chatMessageRepo.findById(chatId)
                .map(chat -> {

                    List<String> deletedUsers = chat.getDeletedForUsers();

                    // ✅ Null safety
                    if (deletedUsers == null) {
                        deletedUsers = new ArrayList<>();
                    }

                    if (!deletedUsers.contains(userId)) {
                        deletedUsers.add(userId);
                    }

                    chat.setDeletedForUsers(deletedUsers);
                    chatMessageRepo.save(chat);

                    return true;
                })
                .orElse(false);
    }
}