package com.example.eventmanagerbackend.dto;

import com.example.eventmanagerbackend.enums.EventCategory;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class EventUpdateDto {
    private String id;
    private String title;
    private String description;
    private LocalDate eventDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String city;
    private String location;
    private EventCategory category;
    private float price;
    private int maxParticipants;
}
