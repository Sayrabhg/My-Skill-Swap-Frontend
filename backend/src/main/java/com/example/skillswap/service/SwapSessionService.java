package com.example.skillswap.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.skillswap.model.SwapSession;
import com.example.skillswap.repository.SwapSessionRepository;

@Service
public class SwapSessionService {

    @Autowired
    private SwapSessionRepository repository;

    // Create new session
//    public SwapSession createSession(SwapSession session) {
//        session.setStatus("pending"); // default status
//        return repository.save(session);
//    }
    
    public SwapSession createSession(SwapSession session) {

        String user1 = session.getUser1Id();
        String user2 = session.getUser2Id();

        List<SwapSession> existing =
                repository.findExistingSession(user1, user2);

        if (!existing.isEmpty()) {
            return existing.get(0); // ✅ return first existing
        }

        session.setStatus("pending");
        return repository.save(session);
    }
    
    public SwapSession getSessionBetweenUsers(String user1, String user2) {

        List<SwapSession> sessions =
                repository.findSessionsBetweenUsers(user1, user2);

        if (sessions.isEmpty()) {
            throw new RuntimeException("No session found");
        }

        return sessions.get(0); // return first
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
    
//    public SwapSession createOrGetSession(String user1Id, String user2Id) {
//
//        // Sort users
//        String first = user1Id.compareTo(user2Id) < 0 ? user1Id : user2Id;
//        String second = user1Id.compareTo(user2Id) < 0 ? user2Id : user1Id;
//
//        // Check existing
//        Optional<SwapSession> existing =
//                repository.findByUser1IdAndUser2Id(first, second);
//
//        if (existing.isPresent()) return existing.get();
//
//        // Create new
//        SwapSession session = new SwapSession();
//        session.setUser1Id(first);
//        session.setUser2Id(second);
//        session.setStatus("pending");
//
//        return repository.save(session);
//    }
}