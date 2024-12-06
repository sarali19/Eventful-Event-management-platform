package com.example.eventmanagerbackend.entity;

import com.example.eventmanagerbackend.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "Users")
public class User {
    @Id
    @Column(nullable = false, unique = true)
    private String id = UUID.randomUUID().toString();

    @Column
    private String fullName = "";

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "organizer")
    private List<Event> organizedEvents;

    @ManyToMany(mappedBy = "participants")
    private List<Event> bookedEvents;

    @OneToMany(mappedBy = "user")
    private List<EventRating> ratings;
}
