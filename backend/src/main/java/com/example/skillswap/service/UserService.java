package com.example.skillswap.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.skillswap.dto.UserProfileDTO;
import com.example.skillswap.model.Skill;
import com.example.skillswap.model.User;
import com.example.skillswap.repository.SkillRepository;
import com.example.skillswap.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SkillRepository skillRepository;

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
        User user = userRepository.findById(id).orElse(null);

        if (user != null) {
            // Basic info
            user.setName(updatedUser.getName());
            user.setBio(updatedUser.getBio());
            user.setLanguage(updatedUser.getLanguage());
            user.setAvatar(updatedUser.getAvatar());

            // Contact info
            user.setEmail(updatedUser.getEmail());
            user.setMobileNumber(updatedUser.getMobileNumber());

            // Personal info
            user.setGender(updatedUser.getGender());

            // Address info
            user.setAddress(updatedUser.getAddress());
            user.setCity(updatedUser.getCity());
            user.setState(updatedUser.getState());
            user.setCountry(updatedUser.getCountry());
            user.setPostalCode(updatedUser.getPostalCode());

            // Optional / social links
            user.setWebsite(updatedUser.getWebsite());
            user.setLinkedin(updatedUser.getLinkedin());
            user.setGithub(updatedUser.getGithub());

            return userRepository.save(user);
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
        if (updated.getLanguage() != null) existing.setLanguage(updated.getLanguage());
        if (updated.getBio() != null) existing.setBio(updated.getBio());
        if (updated.getAvatar() != null) existing.setAvatar(updated.getAvatar());

        // Contact info
        if (updated.getMobileNumber() != null) existing.setMobileNumber(updated.getMobileNumber());
        
        // Personal info
        if (updated.getGender() != null) existing.setGender(updated.getGender());

        // Address info
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress());
        if (updated.getCity() != null) existing.setCity(updated.getCity());
        if (updated.getState() != null) existing.setState(updated.getState());
        if (updated.getCountry() != null) existing.setCountry(updated.getCountry());
        if (updated.getPostalCode() != null) existing.setPostalCode(updated.getPostalCode());

        // Optional / social links
        if (updated.getWebsite() != null) existing.setWebsite(updated.getWebsite());
        if (updated.getLinkedin() != null) existing.setLinkedin(updated.getLinkedin());
        if (updated.getGithub() != null) existing.setGithub(updated.getGithub());

        // Do NOT update: email, tokens, rating, trustScore (only admin)
    }
    
    public UserProfileDTO getUserProfile(String userId) {

        User user = userRepository.findById(userId).orElseThrow();
        List<Skill> skills = skillRepository.findByUserId(userId);

        UserProfileDTO dto = new UserProfileDTO();
        dto.setUser(user);
        dto.setSkills(skills);

        return dto;
    }
}