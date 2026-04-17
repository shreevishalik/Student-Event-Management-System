package com.eventmanage.student.repository;

import com.eventmanage.student.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    // Spring Data automatically implements these based on the naming convention
    Optional<Student> findByEmail(String email);
    Optional<Student> findByRollNumber(String rollNumber);
}