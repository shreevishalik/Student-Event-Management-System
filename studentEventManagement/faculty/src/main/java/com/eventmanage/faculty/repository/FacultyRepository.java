package com.eventmanage.faculty.repository;

import com.eventmanage.faculty.model.Faculty;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FacultyRepository extends MongoRepository<Faculty, String> {
}