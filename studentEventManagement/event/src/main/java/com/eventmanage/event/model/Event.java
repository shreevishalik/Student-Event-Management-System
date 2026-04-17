package com.eventmanage.event.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "events")
public class Event {
    @Id
    private String id;
    private String title;
    private String description;
    private String date;
    private String location;
    private String facultyId; // ID of the organizing faculty
    private List<String> registeredStudentIds = new ArrayList<>(); // List of Student IDs

    public Event() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getFacultyId() { return facultyId; }
    public void setFacultyId(String facultyId) { this.facultyId = facultyId; }
    public List<String> getRegisteredStudentIds() { return registeredStudentIds; }
    public void setRegisteredStudentIds(List<String> registeredStudentIds) { this.registeredStudentIds = registeredStudentIds; }
}