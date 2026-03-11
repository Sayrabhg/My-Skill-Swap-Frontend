package com.example.skillswap.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.skillswap.model.User;
import com.example.skillswap.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserRepository repo) {

        return args -> {

            if (repo.findByEmail("admin@skillswap.com").isEmpty()) {

                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

                User admin = new User();

                admin.setName("Admin");
                admin.setEmail("admin@skillswap.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole("ADMIN");
                admin.setTokens(1000);
                admin.setTrustScore(100);
                admin.setRating(5);

                repo.save(admin);

                System.out.println("Default Admin Created");
            }

        };
    }
}