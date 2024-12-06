package com.example.eventmanagerbackend.repository;

import com.example.eventmanagerbackend.entity.EventRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRatingRepository extends JpaRepository<EventRating, String> {
    // Find ratings by event ID
    List<EventRating> findByEventId(String eventId);

    // Find ratings by user ID for a specific event
    Optional<EventRating> findByEventIdAndUserId(String eventId, String userId);

    // Find all ratings for a specific user
    List<EventRating> findByUserId(String userId);
}
