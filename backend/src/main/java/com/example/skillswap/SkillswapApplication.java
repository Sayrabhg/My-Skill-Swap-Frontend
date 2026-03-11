package com.example.skillswap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@SpringBootApplication
public class SkillswapApplication {
	
	private static final Logger logger = LoggerFactory.getLogger(SkillswapApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(SkillswapApplication.class, args);
		logger.info("✅ Backend Skill Swap API is Running Successfully...");
		System.out.println("✅ Backend Skill Swap API is Running Successfully...");
	}

}
