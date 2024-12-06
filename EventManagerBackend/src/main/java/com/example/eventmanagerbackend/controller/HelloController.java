package com.example.eventmanagerbackend.controller;

import com.example.eventmanagerbackend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class HelloController {
    @GetMapping("/")
    public String greeting(){
        return "Hello, world!";
    }

    @GetMapping("/secured")
    public String create(@AuthenticationPrincipal UserPrincipal principal) {
        return "If you see this that means that you are logged in! Your Email is: "
                + principal.getEmail() + " your ID: " + principal.getUserId();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin")
    public String admin(@AuthenticationPrincipal UserPrincipal principal) {
        return "If you see this, you are an admin. Your ID: " + principal.getUserId();
    }
}
