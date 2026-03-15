package com.example.skillswap.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.skillswap.model.SwapSession;
import com.example.skillswap.service.SwapSessionService;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin("*")
public class SwapController {

    @Autowired
    private SwapSessionService sessionService;

    // Create a swap session (logged-in user is userId, swapUserId is the other user)
    @PostMapping("/create/{swapUserId}")
    public ResponseEntity<?> createSwap(
            @PathVariable String swapUserId,
            @RequestBody SwapSession swapSession,
            Principal principal // get logged-in user
    ) {
        try {
            // Assign users
            swapSession.setUserId(principal.getName()); // logged-in user
            swapSession.setSwapUserId(swapUserId);

            SwapSession created = sessionService.createSession(swapSession);
            return ResponseEntity.ok(created);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all sessions where the logged-in user is involved
    @GetMapping("/my-sessions")
    public List<SwapSession> getMySessions(Principal principal) {
        return sessionService.getSessionsByUser(principal.getName());
    }

    // Update session status
    @PutMapping("/updateStatus/{sessionId}")
    public ResponseEntity<SwapSession> updateStatus(
            @PathVariable String sessionId,
            @RequestParam String status
    ) {
        try {
            SwapSession updated = sessionService.updateSessionStatus(sessionId, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all sessions (for admin)
    @GetMapping("/all")
    public List<SwapSession> getAllSessions() {
        return sessionService.getAllSessions();
    }
    
    @DeleteMapping("/deleteExpired")
    public ResponseEntity<String> deleteExpiredSessions() {
        sessionService.deleteExpiredSessions();
        return ResponseEntity.ok("Expired sessions deleted successfully");
    }
}