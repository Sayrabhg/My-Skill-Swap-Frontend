package com.example.skillswap.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.skillswap.model.SwapSession;
import com.example.skillswap.repository.SwapSessionRepository;

@Service
public class SwapSessionService {

    @Autowired
    private SwapSessionRepository repository;

    // Create new session
    public SwapSession createSession(SwapSession session) {
        session.setStatus("pending"); // default status
        return repository.save(session);
    }

    // Get all sessions
    public List<SwapSession> getAllSessions() {
        return repository.findAll();
    }

    // Get session by ID
    public SwapSession getSessionById(String id) {
        return repository.findById(id).orElse(null);
    }
    
    public List<SwapSession> getLearningSessions(String userId){
        return repository.findByUser1Id(userId);
    }

    public List<SwapSession> getTeachingSessions(String userId){
        return repository.findByUser2Id(userId);
    }

    // Update session
    public SwapSession updateSession(SwapSession session) {
        return repository.save(session);
    }

    // Delete session
    public void deleteSession(String id) {
        repository.deleteById(id);
    }
}