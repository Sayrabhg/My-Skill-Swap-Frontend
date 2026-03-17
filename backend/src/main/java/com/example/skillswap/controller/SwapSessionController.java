package com.example.skillswap.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.skillswap.model.SwapSession;
import com.example.skillswap.model.User;
import com.example.skillswap.repository.UserRepository;
import com.example.skillswap.dto.SwapSessionDTO;
import com.example.skillswap.service.SwapSessionService;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin("*")
public class SwapSessionController {

    @Autowired
    private SwapSessionService service;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create/{user2Id}")
    public ResponseEntity<SwapSession> createSession(
            @PathVariable String user2Id,
            @RequestBody SwapSessionDTO dto,
            Principal principal) {

        // Get logged-in user email from Principal
        String email = principal.getName();

        // Find user by email to get actual ID
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (!userOpt.isPresent()) {
            return ResponseEntity.status(404).body(null); // user not found
        }

        User user = userOpt.get(); // get actual User object

        // Create new session
        SwapSession session = new SwapSession();
        session.setUser1Id(user.getId());   // now actual user ID
        session.setUser2Id(user2Id);
        session.setSkill(dto.getSkill());
        session.setScheduledTime(dto.getScheduledTime());
        session.setTokenAmount(dto.getTokenAmount());
        session.setStatus("pending");

        SwapSession created = service.createSession(session);

        return ResponseEntity.ok(created);
    }
    
    @GetMapping
    public ResponseEntity<List<SwapSession>> getAllSessions() {
        return ResponseEntity.ok(service.getAllSessions());
    }

    // Get all sessions
    @GetMapping("/session-between")
    public ResponseEntity<List<SwapSession>> getSessionBetweenUsers(
            @RequestParam String user1Id,
            @RequestParam String user2Id) {

        // Get all sessions
        List<SwapSession> allSessions = service.getAllSessions();

        // Filter sessions where both IDs match (either order)
        List<SwapSession> result = allSessions.stream()
                .filter(s -> 
                    (s.getUser1Id().equals(user1Id) && s.getUser2Id().equals(user2Id)) ||
                    (s.getUser1Id().equals(user2Id) && s.getUser2Id().equals(user1Id))
                )
                .toList();

        return ResponseEntity.ok(result);
    }

    // Get session by ID
    @GetMapping("/{id}")
    public ResponseEntity<SwapSession> getSessionById(@PathVariable String id) {
        SwapSession session = service.getSessionById(id);
        if (session == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(session);
    }

    // Update session
    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            Principal principal) {

        SwapSession session = service.getSessionById(id);

        if (session == null) {
            return ResponseEntity.notFound().build();
        }

        String email = principal.getName();

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        String userId = user.get().getId();

        // Allow only user2Id to update status
        if (!session.getUser2Id().equals(userId)) {
            return ResponseEntity.status(403).body("Only user2 can update the session status");
        }

        session.setStatus(status);

        SwapSession updated = service.updateSession(session);

        return ResponseEntity.ok(updated);
    }
    
//    @GetMapping("/my-learning")
//    public ResponseEntity<List<SwapSession>> myLearningSessions(Principal principal) {
//
//        String userId = principal.getName();
//
//        List<SwapSession> sessions = service.getAllSessions()
//                .stream()
//                .filter(s -> s.getUser1Id().equals(userId))
//                .toList();
//
//        return ResponseEntity.ok(sessions);
//    }
//    
//    @GetMapping("/my-teaching")
//    public ResponseEntity<List<SwapSession>> myTeachingSessions(Principal principal) {
//
//        String userId = principal.getName();
//
//        List<SwapSession> sessions = service.getAllSessions()
//                .stream()
//                .filter(s -> s.getUser2Id().equals(userId))
//                .toList();
//
//        return ResponseEntity.ok(sessions);
//    }
    
    @GetMapping("/my-learning")
    public ResponseEntity<List<SwapSession>> myLearning(Principal principal){

        String email = principal.getName();
        Optional<User> loggedUser = userRepository.findByEmail(email);
        if (loggedUser.isEmpty()) return ResponseEntity.notFound().build();

        String userId = loggedUser.get().getId();
        List<SwapSession> sessions = service.getLearningSessions(userId);

        List<SwapSession> fixedSessions = sessions.stream().map(session -> {
            if(session.getUser1Id().contains("@")){
                Optional<User> userOpt = userRepository.findByEmail(session.getUser1Id());
                userOpt.ifPresent(user -> session.setUser1Id(user.getId()));
            }
            return session;
        }).toList();

        return ResponseEntity.ok(fixedSessions);
    }

    @GetMapping("/my-teaching")
    public ResponseEntity<List<SwapSession>> myTeaching(Principal principal){

        String email = principal.getName();

        // Find logged-in user
        Optional<User> loggedUser = userRepository.findByEmail(email);
        if (loggedUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String userId = loggedUser.get().getId();

        // Get all teaching sessions
        List<SwapSession> sessions = service.getTeachingSessions(userId);

        // Ensure user1Id is actual ID (not email)
        List<SwapSession> fixedSessions = sessions.stream().map(session -> {

            // If user1Id looks like an email, convert to ID
            if(session.getUser1Id().contains("@")) {
                Optional<User> userOpt = userRepository.findByEmail(session.getUser1Id());
                userOpt.ifPresent(user -> session.setUser1Id(user.getId()));
            }

            return session;

        }).toList();

        return ResponseEntity.ok(fixedSessions);
    }

    // Delete session
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteSession(@PathVariable String id) {
        service.deleteSession(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Session deleted successfully");

        return ResponseEntity.ok(response);
    }
}