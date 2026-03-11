package com.example.skillswap.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "user")
public class User {

    @Id
    private String id;

    private String name;
    private String email;
    private String password;

    private String role = "USER"; // Default to USER if not specified

    private String language;
    private String bio;
    private String avatar;

    private double rating;
    private int trustScore;
    private int tokens;

}