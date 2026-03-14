package com.example.skillswap.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.skillswap.model.Skill;
import com.example.skillswap.model.User;
import com.example.skillswap.repository.SkillRepository;
import com.example.skillswap.repository.UserRepository;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserRepository userRepository;

    public Skill addSkill(Skill skill, String email) {

        // Find logged in user
        User user = userRepository.findByEmail(email).orElseThrow();

        // assign skill to user
        skill.setUserId(user.getId());

        // reward tokens
        user.setTokens(user.getTokens() + 10);

        userRepository.save(user);

        return skillRepository.save(skill);
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public List<Skill> getSkillsByUser(String userId) {
        return skillRepository.findByUserId(userId);
    }

    public Optional<Skill> getSkillsBySkillsId(String id) {
    	return skillRepository.findById(id);
    }

    public void deleteSkill(String skillId) {
        skillRepository.deleteById(skillId);
    }
}