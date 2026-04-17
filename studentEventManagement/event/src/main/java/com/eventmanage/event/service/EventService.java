package com.eventmanage.event.service;

import com.eventmanage.event.model.Event;
import com.eventmanage.event.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(String id) {
        return eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public Event registerStudent(String eventId, String studentId) {
        Event event = getEventById(eventId);
        if (!event.getRegisteredStudentIds().contains(studentId)) {
            event.getRegisteredStudentIds().add(studentId);
        }
        return eventRepository.save(event);
    }
}