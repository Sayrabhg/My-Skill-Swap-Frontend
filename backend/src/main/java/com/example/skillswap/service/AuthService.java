package com.example.skillswap.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.skillswap.config.JwtUtil;
import com.example.skillswap.dto.LoginRequest;
import com.example.skillswap.dto.RoleLoginResponse;
import com.example.skillswap.dto.SignupRequest;
import com.example.skillswap.dto.SignupResponse;
import com.example.skillswap.model.User;
import com.example.skillswap.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // Signup with role-based assignment
    public SignupResponse signup(SignupRequest request){
        
        System.out.println("=== SIGNUP REQUEST RECEIVED ===");
        System.out.println("Full request object: " + request);
        System.out.println("Name: " + request.getName());
        System.out.println("Email: " + request.getEmail());
        System.out.println("Language: " + request.getLanguage());
        System.out.println("Role from request: '" + request.getRole() + "'");
        System.out.println("Role is null: " + (request.getRole() == null));
        System.out.println("Role is empty: " + ("".equals(request.getRole())));

        Optional<User> existing = userRepository.findByEmail(request.getEmail());
        if(existing.isPresent()){
            System.out.println("Email already exists");
            return new SignupResponse("Email already exists", null, request.getEmail(), false);
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setLanguage(request.getLanguage());

        // Set role: use provided role if valid, otherwise default to USER
        String role = request.getRole();
        String assignedRole = "USER"; // default
        String message = "Signup successful as USER";
        
        System.out.println("Initial role value: '" + role + "'");
        
        if (role != null && !role.trim().isEmpty()) {
            role = role.toUpperCase().trim();
            System.out.println("After toUpperCase and trim: '" + role + "'");
            
            if (role.equals("ADMIN")) {
                assignedRole = "ADMIN";
                message = "Signup successful! You have been registered as ADMIN with full access";
                System.out.println("✓ ADMIN role assigned");
            } else if (role.equals("USER")) {
                assignedRole = "USER";
                message = "Signup successful as USER";
                System.out.println("✓ USER role assigned");
            } else {
                System.out.println("✗ Invalid role: '" + role + "', defaulting to USER");
                assignedRole = "USER";
            }
        } else {
            System.out.println("✗ Role is null or empty, defaulting to USER");
        }
        
        user.setRole(assignedRole);
        System.out.println("Setting user role to: '" + assignedRole + "'");
        System.out.println("User object role before save: " + user.getRole());
        
        user.setTokens(100);
        user.setTrustScore(0);
        user.setRating(0);

        User savedUser = userRepository.save(user);
        
        System.out.println("User saved to DB");
        System.out.println("Saved user role from DB: '" + savedUser.getRole() + "'");
        System.out.println("Saved user ID: " + savedUser.getId());
        
        // Verify by re-fetching from DB
        Optional<User> verification = userRepository.findByEmail(request.getEmail());
        if (verification.isPresent()) {
            System.out.println("Verification: Role in DB is: '" + verification.get().getRole() + "'");
        }
        
        System.out.println("=== SIGNUP COMPLETE ===\n");

        return new SignupResponse(message, assignedRole, user.getEmail(), true);
    }

    // Login with role info
    public RoleLoginResponse login(LoginRequest request){
        
        System.out.println("\n=== LOGIN REQUEST RECEIVED ===");
        System.out.println("Email: " + request.getEmail());

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if(userOpt.isEmpty()){
            System.out.println("User not found: " + request.getEmail());
            return new RoleLoginResponse(null, null, "User not found");
        }

        User user = userOpt.get();
        
        System.out.println("✓ User found: " + user.getEmail());
        System.out.println("User ID: " + user.getId());
        System.out.println("Role from DB: '" + user.getRole() + "'");
        System.out.println("Role type: " + (user.getRole() == null ? "NULL" : user.getRole().getClass().getSimpleName()));

        if(!encoder.matches(request.getPassword(), user.getPassword())){
            System.out.println("✗ Password mismatch");
            return new RoleLoginResponse(null, null, "Invalid password");
        }
        
        System.out.println("✓ Password matches");

        String token = JwtUtil.generateToken(user.getEmail());
        String role = user.getRole();
        
        System.out.println("Token generated for: " + user.getEmail());
        
        // Ensure role is not null
        if (role == null || role.isEmpty()) {
            role = "USER";
            System.out.println("⚠ Role was null/empty, defaulting to USER");
        }
        
        System.out.println("Final role being returned: '" + role + "'");
        System.out.println("=== LOGIN COMPLETE ===\n");

        return new RoleLoginResponse(token, role, "Login successful");
    }
}