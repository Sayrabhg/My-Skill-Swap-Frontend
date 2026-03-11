package com.example.skillswap.dto;

import lombok.Data;

@Data
public class RoleLoginResponse {
    private String token;
    private String role;
    private String message;

    // No-arg constructor
    public RoleLoginResponse() {}

    // Constructor for success response
    public RoleLoginResponse(String token, String role, String message) {
        this.token = token;
        this.role = role;
        this.message = message;
    }

    // Constructor for error response
    public RoleLoginResponse(String message) {
        this.token = null;
        this.role = null;
        this.message = message;
    }
}