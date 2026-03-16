package com.example.skillswap.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.skillswap.model.SwapSession;

public interface SwapSessionRepository extends MongoRepository<SwapSession, String> {
    List<SwapSession> findByUser1Id(String user1Id);

    List<SwapSession> findByUser2Id(String user2Id);
}