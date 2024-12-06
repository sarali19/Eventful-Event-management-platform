package com.example.eventmanagerbackend.repository;

import com.example.eventmanagerbackend.entity.User;
import com.example.eventmanagerbackend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // Find a user by their email
    Optional<User> findByEmail(String email);

    // Check if a user exists by their email
    boolean existsByEmail(String email);

    // Find users by role (ADMIN or MEMBER)
    List<User> findByRole(Role role);

    // Find all users who have booked a specific event
    @Query("SELECT u FROM User u JOIN u.bookedEvents e WHERE e.id = :eventId")
    List<User> findUsersByBookedEvent(@Param("eventId") String eventId);
}
