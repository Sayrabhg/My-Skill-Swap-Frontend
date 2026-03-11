package com.example.skillswap.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.skillswap.model.User;
import com.example.skillswap.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    // ---------------- GET CURRENT LOGGED-IN USER ----------------
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        String email = authentication.getName(); // email from JWT
        Optional<User> userOpt = userService.getUserByEmail(email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.status(404).body("User not found");
    }

    // ---------------- UPDATE CURRENT LOGGED-IN USER ----------------
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(Authentication authentication, @RequestBody User user) {
        String email = authentication.getName();
        User updated = userService.updateUserByEmail(email, user);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(404).body("User not found");
    }

    // ---------------- DELETE CURRENT LOGGED-IN USER ----------------
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        // Prevent default admin deletion
        if ("admin@skillswap.com".equalsIgnoreCase(email)) {
            return ResponseEntity.status(403).body("Default admin cannot be deleted");
        }

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        boolean deleted = userService.deleteUserByEmail(email);

        if (deleted) {
            if (isAdmin) {
                return ResponseEntity.ok("Admin account deleted successfully");
            } else {
                return ResponseEntity.ok("User account deleted successfully");
            }
        }

        return ResponseEntity.status(404).body("User not found");
    }

}