package com.example.skillswap.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.skillswap.model.User;
import com.example.skillswap.repository.UserRepository;
import com.example.skillswap.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;

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

        boolean deleted = userService.deleteUserByEmail(email);

        if (deleted) {
            return ResponseEntity.ok("User account deleted successfully");
        }

        return ResponseEntity.status(404).body("User not found");
    }

    // ---------------- GET USER PROFILE WITH SKILLS ----------------
    @GetMapping("/me/profile")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userService.getUserByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(userService.getUserProfile(user.getId()));
        }

        return ResponseEntity.status(404).body("User not found");
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable String id,
            @RequestBody User updatedUser
    ) {
        User user = userRepository.findById(id).orElseThrow();

        user.setFirstLogin(updatedUser.isFirstLogin());

        userRepository.save(user);

        return ResponseEntity.ok(user);
    }
}