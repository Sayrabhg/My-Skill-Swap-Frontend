package com.example.skillswap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {

    private String name;
    private String email;
    private String password;
    private String language;
    private String role; // Optional: USER or ADMIN (defaults to USER if not provided)
}