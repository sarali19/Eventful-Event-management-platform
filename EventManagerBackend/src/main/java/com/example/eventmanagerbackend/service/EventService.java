package com.example.eventmanagerbackend.service;

import com.example.eventmanagerbackend.dto.EventCreateDto;
import com.example.eventmanagerbackend.dto.EventResponseDto;
import com.example.eventmanagerbackend.dto.EventUpdateDto;
import com.example.eventmanagerbackend.entity.Event;
import com.example.eventmanagerbackend.entity.EventRating;
import com.example.eventmanagerbackend.entity.User;
import com.example.eventmanagerbackend.enums.EventCategory;
import com.example.eventmanagerbackend.repository.EventRatingRepository;
import com.example.eventmanagerbackend.repository.EventRepository;
import com.example.eventmanagerbackend.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventRatingRepository eventRatingRepository;
    @Autowired
    private ModelMapper modelMapper;

    public EventResponseDto createEvent(EventCreateDto eventDto, String organizerId) {
        // Find organizer
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new EntityNotFoundException("Organizer not found"));
        // Convert DTO to Entity
        Event event = modelMapper.map(eventDto, Event.class);
        event.setOrganizer(organizer);
        event.setParticipants(new ArrayList<>());
        event.setCurrentParticipants(0);
        event.setAverageRating(0.f);
        event.setRatings(new ArrayList<>());
        // Save event
        event = eventRepository.save(event);

        // Convert to response DTO
        return modelMapper.map(event, EventResponseDto.class);
    }

    public EventResponseDto updateEvent(EventUpdateDto eventDto) {
        Event existingEvent = eventRepository.findById(eventDto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Map the provided DTO to the existing event
        existingEvent.setTitle(eventDto.getTitle());
        existingEvent.setDescription(eventDto.getDescription());
        existingEvent.setEventDate(eventDto.getEventDate());
        existingEvent.setStartTime(eventDto.getStartTime());
        existingEvent.setEndTime(eventDto.getEndTime());
        existingEvent.setCity(eventDto.getCity());
        existingEvent.setLocation(eventDto.getLocation());
        existingEvent.setCategory(eventDto.getCategory());
        existingEvent.setMaxParticipants(eventDto.getMaxParticipants());

        // Save the updated event
        Event updatedEvent = eventRepository.save(existingEvent);

        // Return the updated event as a response DTO
        return modelMapper.map(updatedEvent, EventResponseDto.class);
    }

    public List<EventResponseDto> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateAsc()
                .stream()
                .map(event -> modelMapper.map(event, EventResponseDto.class))
                .collect(Collectors.toList());
    }

    public EventResponseDto getById(String eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event not found"));
        // Convert to response DTO
        return modelMapper.map(event, EventResponseDto.class);
    }

    public void deleteById(String eventId) {
        eventRepository.deleteById(eventId);
    }

    @Transactional
    public void bookEvent(String eventId, String organizerId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        addParticipant(event); // Will throw an error if capacity is full
        event.getParticipants().add(user);
        eventRepository.save(event);
    }

    @Transactional
    public void rateEvent(String eventId, String userId, int rating) {
        // Check if event exists
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

//         Check if the user has already rated the event
        Optional<EventRating> existingRating = eventRatingRepository.findByEventIdAndUserId(eventId, userId);
        if (existingRating.isPresent()) {
            existingRating.get().setRating(rating);
            eventRatingRepository.save(existingRating.get());
        }
        else {
            EventRating eventRating = new EventRating();
            eventRating.setEvent(event);
            eventRating.setUser(user);
            eventRating.setRating(rating);
            eventRatingRepository.save(eventRating);
        }
        updateEventAverageRating(event, rating);
    }
    public List<Event> findByCategory(EventCategory category) {
        return eventRepository.findByCategory(category);
    }

    // Get events by a specific city
    public List<Event> findByCity(String city) {
        return eventRepository.findByCity(city);
    }

    // Get events by title containing a specific keyword
    public List<Event> findByTitleContainingIgnoreCase(String keyword) {
        return eventRepository.findByTitleContainingIgnoreCase(keyword);
    }

    // Get events occurring after a specific date
    public List<Event> findByEventDateAfter(LocalDate date) {
        return eventRepository.findByEventDateAfter(date);
    }

    // Find events organized by a specific user
    public List<EventResponseDto> findByOrganizerId(String organizerId) {
        return eventRepository.findByOrganizerId(organizerId)
                .stream()
                .map(event -> modelMapper.map(event, EventResponseDto.class))
                .collect(Collectors.toList());
    }

    private void addParticipant(Event event) {
        int currentParticipants = event.getCurrentParticipants();
        int maxParticipants = event.getMaxParticipants();
        if (currentParticipants < maxParticipants) {
            event.setCurrentParticipants(currentParticipants+1);
        } else {
            throw new RuntimeException("Event is full");
        }
    }

    private void updateEventAverageRating(Event event, int userRating) {
        List<EventRating> ratings = event.getRatings();
        if (!ratings.isEmpty()) {
            float totalRating = 0;
            for (EventRating rating : ratings) {
                totalRating += rating.getRating();
            }
            float averageRating = (float) totalRating / ratings.size();
            event.setAverageRating(averageRating);

        }
        else {
            event.setAverageRating((float) userRating);
        }

        eventRepository.save(event);
    }

    public List<EventResponseDto> findAllByParticipantId(String userId) {
        return eventRepository.findAllByParticipants_Id(userId).stream()
                .map(event -> modelMapper.map(event, EventResponseDto.class))
                .collect(Collectors.toList());
    }
}
