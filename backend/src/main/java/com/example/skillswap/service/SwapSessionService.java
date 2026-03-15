package com.example.skillswap.service;

import java.util.List;
import com.example.skillswap.model.SwapSession;

public interface SwapSessionService {

    SwapSession createSession(SwapSession session);

    List<SwapSession> getSessionsByUser(String userId);

    SwapSession updateSessionStatus(String id, String status);

    List<SwapSession> getAllSessions();

    void deleteExpiredSessions();
}