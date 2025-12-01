package com.soumya.neurofleetx.controller;

import com.soumya.neurofleetx.dto.LoginRequest;
import com.soumya.neurofleetx.entity.User;
import com.soumya.neurofleetx.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword()));
    }

    @GetMapping("/drivers")
    public List<User> getDrivers() {
        return userService.getAllUsers().stream()
                .filter(u -> u.getRole() == User.Role.Driver)
                .collect(Collectors.toList());
    }


}