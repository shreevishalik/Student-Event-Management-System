package com.eventmanage.student.controller;

import com.eventmanage.student.model.Student;
import com.eventmanage.student.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Create a new student profile
    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.saveStudent(student));
    }

    // Get all students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // Get the currently logged-in student's profile using the JWT token context
    @GetMapping("/me")
    public ResponseEntity<Student> getMyProfile(Authentication authentication) {
        // authentication.getName() gets the email/username we extracted from the JWT token in the filter
        String email = authentication.getName();
        return ResponseEntity.ok(studentService.getStudentByEmail(email));
    }

    // Get a specific student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable String id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    // Update an existing student's data
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable String id, @RequestBody Student updatedStudent) {
        Student existingStudent = studentService.getStudentById(id);

        // Update fields
        existingStudent.setFullName(updatedStudent.getFullName());
        existingStudent.setDepartment(updatedStudent.getDepartment());
        existingStudent.setYearOfStudy(updatedStudent.getYearOfStudy());
        existingStudent.setRollNumber(updatedStudent.getRollNumber());

        return ResponseEntity.ok(studentService.saveStudent(existingStudent));
    }

    // Delete a student
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable String id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok("Student deleted successfully");
    }
}