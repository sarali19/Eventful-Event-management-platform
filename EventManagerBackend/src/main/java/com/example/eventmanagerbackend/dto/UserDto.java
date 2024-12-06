package com.example.eventmanagerbackend.dto;

import com.example.eventmanagerbackend.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private String id;
    private String email;
    private String fullName;
    private Role role;
}
