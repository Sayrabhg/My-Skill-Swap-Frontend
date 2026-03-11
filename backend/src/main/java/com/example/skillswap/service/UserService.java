package com.example.skillswap.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.skillswap.model.User;
import com.example.skillswap.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // ---------------- GET ALL USERS (ADMIN) ----------------
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ---------------- GET USER BY ID (ADMIN) ----------------
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // ---------------- GET USER BY EMAIL (JWT) ----------------
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ---------------- UPDATE USER BY ID (ADMIN) ----------------
    public User updateUser(String id, User updatedUser) {
        Optional<User> existingOpt = userRepository.findById(id);
        if (existingOpt.isPresent()) {
            User existing = existingOpt.get();
            copyUserFields(existing, updatedUser);
            return userRepository.save(existing);
        }
        return null;
    }

    // ---------------- UPDATE CURRENT USER BY EMAIL (JWT) ----------------
    public User updateUserByEmail(String email, User updatedUser) {
        Optional<User> existingOpt = userRepository.findByEmail(email);
        if (existingOpt.isPresent()) {
            User existing = existingOpt.get();
            copyUserFields(existing, updatedUser);
            return userRepository.save(existing);
        }
        return null;
    }

    // ---------------- DELETE USER BY ID (ADMIN) ----------------
    public boolean deleteUser(String id) {
        Optional<User> existingOpt = userRepository.findById(id);
        if (existingOpt.isPresent()) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ---------------- DELETE CURRENT USER BY EMAIL (JWT) ----------------
    public boolean deleteUserByEmail(String email) {
        Optional<User> existingOpt = userRepository.findByEmail(email);
        if (existingOpt.isPresent()) {
            userRepository.delete(existingOpt.get());
            return true;
        }
        return false;
    }

    // ---------------- HELPER: copy fields ----------------
    private void copyUserFields(User existing, User updated) {
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getEmail() != null) existing.setEmail(updated.getEmail());
        if (updated.getLanguage() != null) existing.setLanguage(updated.getLanguage());
        if (updated.getBio() != null) existing.setBio(updated.getBio());
        if (updated.getAvatar() != null) existing.setAvatar(updated.getAvatar());
        // Tokens, rating, trustScore should be updated only by admin
    }
}