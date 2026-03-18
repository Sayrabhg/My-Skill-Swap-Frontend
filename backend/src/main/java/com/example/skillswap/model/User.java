package com.example.skillswap.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Document(collection = "user")
public class User {

    @Id
    private String id;

    private String name;
    private String email;
    private String password;

    private String role = "USER";

    private String language;
    private String bio;
    private String avatar;

    private double rating;
    private int trustScore;
    private int tokens;

    @Pattern(regexp = "^[0-9]{10}$")
    private String mobileNumber;
    private String gender;

    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    private String website;
    private String linkedin;
    private String github;

    // ✅ ADD THIS
    private boolean isFirstLogin = true;
}