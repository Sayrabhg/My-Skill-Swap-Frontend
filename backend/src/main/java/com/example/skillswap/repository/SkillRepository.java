package com.example.skillswap.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.skillswap.model.Skill;

public interface SkillRepository extends MongoRepository<Skill, String> {

}