// src/main/java/com/soumya/neurofleetx/service/VehicleService.java
package com.soumya.neurofleetx.service;

import com.soumya.neurofleetx.entity.Vehicle;
import com.soumya.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        vehicle.setStatus("AVAILABLE");
        vehicle.setLastUpdated(LocalDateTime.now());
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle updated) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setLicensePlate(updated.getLicensePlate());
        vehicle.setMake(updated.getMake());
        vehicle.setModel(updated.getModel());
        vehicle.setManufacturingYear(updated.getManufacturingYear());
        vehicle.setVin(updated.getVin());
        vehicle.setStatus(updated.getStatus());
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    // This is the ONLY telemetry method you need – perfect and working
    public Vehicle updateTelemetry(Long id, Map<String, Object> updates) {
        Vehicle vehicle = getVehicleById(id);

        if (updates.containsKey("latitude")) {
            vehicle.setLatitude(((Number) updates.get("latitude")).doubleValue());
        }
        if (updates.containsKey("longitude")) {
            vehicle.setLongitude(((Number) updates.get("longitude")).doubleValue());
        }
        if (updates.containsKey("speed")) {
            vehicle.setSpeed(((Number) updates.get("speed")).doubleValue());
        }
        if (updates.containsKey("fuelLevel")) {
            vehicle.setFuelLevel(((Number) updates.get("fuelLevel")).doubleValue());
        }

        vehicle.setLastUpdated(LocalDateTime.now());
        return vehicleRepository.save(vehicle);
    }

    // Optional: nice record if you want to use it later (not used now)
    public record TelemetryUpdate(
            Double latitude,
            Double longitude,
            Double speed,
            Double fuelLevel
    ) {}
}