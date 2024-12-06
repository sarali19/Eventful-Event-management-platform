package com.example.eventmanagerbackend.service;

import aj.org.objectweb.asm.commons.Remapper;
import com.example.eventmanagerbackend.entity.User;
import com.example.eventmanagerbackend.enums.Role;
import com.example.eventmanagerbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public Optional<User>findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public boolean existsByEmail(String email){
        return userRepository.existsByEmail(email);
    }

    public List<User> findUsersByBookedEvent(String eventId){
        return userRepository.findUsersByBookedEvent(eventId);
    }
    public Optional<User>findById(String id) {
        return userRepository.findById(id);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already registered.");
        }
        // Generate a UUID if it's not already set
        if (user.getId() == null || user.getId().isEmpty()) {
            user.setId(UUID.randomUUID().toString());
        }
        return userRepository.save(user);
    }

    public User updateUser(String id, String email, String password, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already registered");
        }
        user.setEmail(email);

        if (password != null && !password.isEmpty()) {
            user.setPassword(password);
        }
        user.setRole(role);

        return userRepository.save(user);
    }
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }

}
