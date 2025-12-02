// src/main/java/com/soumya/neurofleetx/controller/DriverController.java
package com.soumya.neurofleetx.controller;

import com.soumya.neurofleetx.entity.DeliveryJob;
import com.soumya.neurofleetx.entity.User;
import com.soumya.neurofleetx.repository.DeliveryJobRepository;     // ← ADD THIS IMPORT
import com.soumya.neurofleetx.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DriverController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private DeliveryJobRepository deliveryRepo;   // ← ADD THIS LINE

    // Get all drivers (for assignment dropdown)
    @GetMapping("/drivers")
    public ResponseEntity<List<User>> getAllDrivers() {
        List<User> drivers = userRepo.findAll().stream()
                .filter(user -> user.getRole() == User.Role.Driver)
                .collect(Collectors.toList());
        return ResponseEntity.ok(drivers);
    }

    // GET MY DELIVERIES AS DRIVER — NOW WORKS 100%
    @GetMapping("/deliveries/driver/{driverId}")
    public List<DeliveryJob> getDeliveriesForDriver(@PathVariable Long driverId) {
        return deliveryRepo.findByAssignedDriverId(driverId);
    }
}