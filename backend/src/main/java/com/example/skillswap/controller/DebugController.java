package com.example.skillswap.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.skillswap.dto.SignupRequest;
import com.example.skillswap.model.User;
import com.example.skillswap.repository.UserRepository;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin("*")
public class DebugController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsersWithRoles() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(404).body("User not found");
    }

    @DeleteMapping("/user/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUserByEmail(@PathVariable String email) {

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {

            User u = user.get();
            String role = u.getRole();

            userRepository.delete(u);

            if ("ADMIN".equalsIgnoreCase(role)) {
                return ResponseEntity.ok("This Admin " + email + " deleted successfully");
            } else {
                return ResponseEntity.ok("This User " + email + " deleted successfully");
            }
        }

        return ResponseEntity.status(404).body("User not found");
    }

    @PostMapping("/create-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTestAdmin(@RequestBody SignupRequest request) {

        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body("Admin with this email already exists");
        }

        User admin = new User();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(new BCryptPasswordEncoder().encode(request.getPassword()));
        admin.setRole("ADMIN");
        admin.setLanguage(request.getLanguage() != null ? request.getLanguage() : "English");
        admin.setTokens(100);
        admin.setTrustScore(0);
        admin.setRating(0);

        User saved = userRepository.save(admin);

        return ResponseEntity.ok(new Object() {
            public String message = "Admin created successfully";
            public String email = saved.getEmail();
            public String role = saved.getRole();
            public String name = saved.getName();
        });
    }
}
