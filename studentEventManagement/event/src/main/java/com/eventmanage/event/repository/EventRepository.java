package com.eventmanage.event.repository;

import com.eventmanage.event.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    // Basic CRUD operations are handled by MongoRepository
}