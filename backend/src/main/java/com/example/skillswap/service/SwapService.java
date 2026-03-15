package com.example.skillswap.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.skillswap.model.SwapSession;
import com.example.skillswap.repository.SwapRepository;

@Service
public class SwapService implements SwapSessionService {

    @Autowired
    private SwapRepository swapRepository;

    @Override
    public SwapSession createSession(SwapSession session) {
        if(session.getUserId().equals(session.getSwapUserId())) {
            throw new IllegalArgumentException("Cannot swap with yourself.");
        }
        session.setStatus("PENDING"); // default status
        return swapRepository.save(session);
    }

    // Get all swap sessions where logged-in user is involved
    @Override
    public List<SwapSession> getSessionsByUser(String userId) {
        return swapRepository.findByUserIdOrSwapUserId(userId, userId);
    }

    // Update status of a swap session
    @Override
    public SwapSession updateSessionStatus(String id, String status) {
        SwapSession session = swapRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setStatus(status.toUpperCase());
        return swapRepository.save(session);
    }

    // Get all sessions (optional admin view)
    @Override
    public List<SwapSession> getAllSessions() {
        return swapRepository.findAll();
    }

    // Delete expired sessions
    @Override
    public void deleteExpiredSessions() {
        List<SwapSession> allSessions = swapRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        allSessions.stream()
            .filter(session -> session.getScheduledTime() != null
                    && session.getScheduledTime().isBefore(now))
            .forEach(session -> swapRepository.delete(session));
    }
}