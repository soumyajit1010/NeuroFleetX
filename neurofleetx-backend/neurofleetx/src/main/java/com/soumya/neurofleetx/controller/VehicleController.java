// src/main/java/com/soumya/neurofleetx/controller/VehicleController.java
package com.soumya.neurofleetx.controller;

import com.soumya.neurofleetx.entity.Vehicle;
import com.soumya.neurofleetx.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @PostMapping
    public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.createVehicle(vehicle);
    }

    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        return vehicleService.updateVehicle(id, vehicle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok().build();
    }

    // THIS IS THE ONLY ONE YOU NEED — works perfectly with your frontend
    @PatchMapping("/{id}/telemetry")
    public ResponseEntity<Vehicle> updateTelemetry(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        Vehicle vehicle = vehicleService.updateTelemetry(id, updates);
        return ResponseEntity.ok(vehicle);
    }
}