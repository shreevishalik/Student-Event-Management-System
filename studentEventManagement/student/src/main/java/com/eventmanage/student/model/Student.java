package com.eventmanage.student.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
public class Student {

    @Id
    private String id;

    private String email;
    private String fullName;
    private String rollNumber;
    private String department;
    private int yearOfStudy;

    // Default constructor required by Spring Data MongoDB
    public Student() {
    }

    public Student(String email, String fullName, String rollNumber, String department, int yearOfStudy) {
        this.email = email;
        this.fullName = fullName;
        this.rollNumber = rollNumber;
        this.department = department;
        this.yearOfStudy = yearOfStudy;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(int yearOfStudy) { this.yearOfStudy = yearOfStudy; }
}
