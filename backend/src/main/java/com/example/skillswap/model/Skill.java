package com.example.skillswap.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "skills")
public class Skill {

    @Id
    private String id;

    private String skillOffered;
    private String skillWanted;
    private String category;

    private String userId;

}