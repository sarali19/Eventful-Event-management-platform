package com.example.eventmanagerbackend.controller;

import com.example.eventmanagerbackend.entity.EventRating;
import com.example.eventmanagerbackend.service.EventRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/event-ratings")
@RequiredArgsConstructor
public class EventRatingController {
    private final EventRatingService eventRatingService;

    // Get all ratings for a specific event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventRating>> getRatingsByEventId(@PathVariable String eventId) {
        List<EventRating> ratings = eventRatingService.findByEventId(eventId);
        return ResponseEntity.ok(ratings);
    }

    // Get all ratings by a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EventRating>> getRatingsByUserId(@PathVariable String userId) {
        List<EventRating> ratings = eventRatingService.findByUserId(userId);
        return ResponseEntity.ok(ratings);
    }
}
