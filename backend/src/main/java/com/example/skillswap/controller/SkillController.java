package com.example.skillswap.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.skillswap.model.Skill;
import com.example.skillswap.service.SkillService;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin("*")
public class SkillController {

    @Autowired
    private SkillService skillService;

    // Add skill with logged-in user
    @PostMapping("/add")
    public Skill addSkill(@RequestBody Skill skill, Principal principal) {

        // principal.getName() returns logged in user's email
        return skillService.addSkill(skill, principal.getName());
    }

    @GetMapping("/all")
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    @GetMapping("/user/{userId}")
    public List<Skill> getSkillsByUser(@PathVariable String userId) {
        return skillService.getSkillsByUser(userId);
    }

    @GetMapping("/skill/{id}")
    public Optional<Skill> getSkillsBySkillsId(@PathVariable String id) {
    	return skillService.getSkillsBySkillsId(id);
    }

    @DeleteMapping("/delete/{skillId}")
    public String deleteSkill(@PathVariable String skillId) {
        skillService.deleteSkill(skillId);
        return "Skill deleted with SkillId " + skillId;
    }
}