package com.example.skillswap.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.skillswap.model.Contact;

public interface ContactRepository extends MongoRepository<Contact, String> {

}