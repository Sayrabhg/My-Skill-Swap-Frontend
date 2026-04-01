package com.example.skillswap.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.skillswap.model.SwapSession;

public interface SwapSessionRepository extends MongoRepository<SwapSession, String> {
    List<SwapSession> findByUser1Id(String user1Id);

    List<SwapSession> findByUser2Id(String user2Id);
    
    Optional<SwapSession> findByUser1IdAndUser2Id(String user1Id, String user2Id);
    
    @Query("""
    		{
    		  $or: [
    		    { user1Id: ?0, user2Id: ?1 },
    		    { user1Id: ?1, user2Id: ?0 }
    		  ]
    		}
    		""")
    		List<SwapSession> findExistingSession(String user1Id, String user2Id);
    
    @Query("""
    		{
    		  $or: [
    		    { user1Id: ?0, user2Id: ?1 },
    		    { user1Id: ?1, user2Id: ?0 }
    		  ]
    		}
    		""")
    		List<SwapSession> findSessionsBetweenUsers(String user1Id, String user2Id);
}