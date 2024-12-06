package com.example.eventmanagerbackend.controller;

import com.example.eventmanagerbackend.dto.EventCreateDto;
import com.example.eventmanagerbackend.dto.EventRatingDto;
import com.example.eventmanagerbackend.dto.EventResponseDto;
import com.example.eventmanagerbackend.dto.EventUpdateDto;
import com.example.eventmanagerbackend.entity.Event;
import com.example.eventmanagerbackend.enums.EventCategory;
import com.example.eventmanagerbackend.security.UserPrincipal;
import com.example.eventmanagerbackend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<EventResponseDto> createEvent(@RequestBody EventCreateDto event,
                                            @AuthenticationPrincipal UserPrincipal user
    ) {
            EventResponseDto createdEvent = eventService.createEvent(event, user.getUserId());
            return ResponseEntity.ok(createdEvent);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<EventResponseDto> updateEvent(@RequestBody EventUpdateDto event
    ) {
        EventResponseDto updatedEvent = eventService.updateEvent(event);
        return ResponseEntity.ok(updatedEvent);
    }

    // Get all events
    @GetMapping("/all")
    public ResponseEntity getAllEvents() {
        try {
            List<EventResponseDto> events = eventService.getAllEvents();
            return ResponseEntity.ok(events);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @GetMapping("/{eventId}")
    public ResponseEntity getEventById(@PathVariable String eventId) {
        try {
            EventResponseDto event = eventService.getById(eventId);
            return ResponseEntity.ok(event);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity deleteById(@PathVariable String eventId) {
        try {
            eventService.deleteById(eventId);
            return ResponseEntity.ok("Event deleted");
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('MEMBER')")
    @PostMapping("/{eventId}/book")
    public ResponseEntity<Void> bookEvent(@PathVariable String eventId,
                                                        @AuthenticationPrincipal UserPrincipal user
    ) {
        eventService.bookEvent(eventId, user.getUserId());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAuthority('MEMBER')")
    @PostMapping("/{eventId}/rate")
    public ResponseEntity<Void> rateEvent(@PathVariable String eventId,
                                          @RequestBody EventRatingDto eventRating,
                                          @AuthenticationPrincipal UserPrincipal user
    ) {
        eventService.rateEvent(eventId, user.getUserId(), eventRating.getRating());
        return ResponseEntity.ok().build();
    }

    // Get events by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Event>> findByCategory(@PathVariable EventCategory category) {
        return ResponseEntity.ok(eventService.findByCategory(category));
    }

    // Get events by city
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Event>> getEventsByCity(@PathVariable String city) {
        return ResponseEntity.ok(eventService.findByCity(city));
    }

    // Get events by title containing a specific keyword
    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEventsByTitle(@RequestParam String keyword) {
        return ResponseEntity.ok(eventService.findByTitleContainingIgnoreCase(keyword));
    }

    // Get events occurring after a specific date
    @GetMapping("/date")
    public ResponseEntity<List<Event>> getEventsByDateAfter(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(eventService.findByEventDateAfter(date));
    }

    // Get events organized by a specific user
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/organizer")
    public ResponseEntity<List<EventResponseDto>> getEventsByOrganizer( @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(eventService.findByOrganizerId(user.getUserId()));
    }

    @PreAuthorize("hasAuthority('MEMBER')")
    @GetMapping("/bookings")
    public ResponseEntity<List<EventResponseDto>> getBookedEventsByUser(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(eventService.findAllByParticipantId(user.getUserId()));
    }

}
