package com.example.skillswap.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.skillswap.model.SwapSession;

public interface SwapRepository extends MongoRepository<SwapSession, Long> {

}
