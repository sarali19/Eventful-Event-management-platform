package com.example.eventmanagerbackend.service;

import com.example.eventmanagerbackend.entity.Event;
import com.example.eventmanagerbackend.entity.EventRating;
import com.example.eventmanagerbackend.entity.User;
import com.example.eventmanagerbackend.repository.EventRatingRepository;
import com.example.eventmanagerbackend.repository.EventRepository;
import com.example.eventmanagerbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventRatingService {
    @Autowired
    private EventRatingRepository eventRatingRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserRepository userRepository;

    // Get ratings by event
    public List<EventRating> findByEventId(String eventId) {
        return eventRatingRepository.findByEventId(eventId);
    }

    // Get ratings by user
    public List<EventRating> findByUserId(String userId) {
        return eventRatingRepository.findByUserId(userId);
    }

    // Rate an event





}
