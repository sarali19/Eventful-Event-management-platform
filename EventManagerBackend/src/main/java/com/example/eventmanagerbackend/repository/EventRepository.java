package com.example.eventmanagerbackend.repository;

import com.example.eventmanagerbackend.entity.Event;
import com.example.eventmanagerbackend.enums.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {

    // Find events by organizer
    List<Event> findByOrganizerId(String organizer_id);
    List<Event> findAllByParticipants_Id(String user_id);

    // Find events in a specific city
    List<Event> findByCity(String city);

    // Find events by category
    List<Event> findByCategory(EventCategory category);

    // Find events occurring after a specific date
    List<Event> findByEventDateAfter(LocalDate date);

    // Find events by title containing a specific keyword
    List<Event> findByTitleContainingIgnoreCase(String title);

    List<Event> findAllByOrderByEventDateAsc();
}
