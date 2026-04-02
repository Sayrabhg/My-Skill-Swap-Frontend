package com.example.skillswap.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class EmailService {

    @Value("${brevo.api.key}")
    private String apiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name}")
    private String senderName;

    public void sendEmail(String to, String subject, String content) {

        String url = "https://api.brevo.com/v3/smtp/email";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();

        Map<String, String> sender = new HashMap<>();
        sender.put("email", senderEmail);
        sender.put("name", senderName);

        List<Map<String, String>> toList = new ArrayList<>();
        Map<String, String> toMap = new HashMap<>();
        toMap.put("email", to);
        toList.add(toMap);

        body.put("sender", sender);
        body.put("to", toList);
        body.put("subject", subject);
        body.put("htmlContent", content);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        restTemplate.postForEntity(url, request, String.class);
    }
}