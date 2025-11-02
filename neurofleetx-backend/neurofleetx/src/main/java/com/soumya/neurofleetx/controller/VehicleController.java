package com.soumya.neurofleetx.controller;

import com.soumya.neurofleetx.dto.TelemetryUpdateDTO;
import com.soumya.neurofleetx.entity.Vehicle;
import com.soumya.neurofleetx.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @PostMapping
    public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.addVehicle(vehicle);
    }

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/{id}")
    public Vehicle getVehicle(@PathVariable Long id) {
        return vehicleService.getVehicleById(id);
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

    @PutMapping("/{id}/telemetry")
    public Vehicle updateTelemetry(@PathVariable Long id, @RequestBody TelemetryUpdateDTO telemetry) {
        return vehicleService.updateTelemetry(id, telemetry);
    }

    @GetMapping("/available")
    public List<Vehicle> getAvailable() {
        return vehicleService.getAvailableVehicles();
    }
}
