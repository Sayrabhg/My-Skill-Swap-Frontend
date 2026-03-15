package com.example.skillswap.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.skillswap.model.SwapSession;

public interface SwapRepository extends MongoRepository<SwapSession, String> {

    // Find sessions by logged-in user or the swap partner
    List<SwapSession> findByUserIdOrSwapUserId(String userId, String swapUserId);
}