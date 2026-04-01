package com.example.skillswap.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.skillswap.model.ChatRoom;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {

    // Find chat between two users (both directions)
    Optional<ChatRoom> findByUserAIdAndUserBId(String userAId, String userBId);
    Optional<ChatRoom> findByUserBIdAndUserAId(String userBId, String userAId);

    // Get all pending requests received by a user (UserB)
    List<ChatRoom> findByUserBIdAndStatus(String userBId, String status);
    
    @Query("{ '$or': [ { 'userAId': ?0, 'status': ?1 }, { 'userBId': ?0, 'status': ?1 } ] }")
    List<ChatRoom> findUserConnections(
            @Param("userId") String userId,
            @Param("status") String status
    );
    
    // ✅ NO JOIN QUERY - REMOVED BROKEN METHOD
}