package com.soumya.neurofleetx.service;

import com.soumya.neurofleetx.dto.TelemetryUpdateDTO;
import com.soumya.neurofleetx.entity.Vehicle;
import com.soumya.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepo;

    // ==================== CRUD Operations ====================

    public List<Vehicle> getAllVehicles() {
        return vehicleRepo.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
    }

    public Vehicle addVehicle(Vehicle vehicle) {
        // Optional: Validate registration number uniqueness
        if (vehicleRepo.existsByRegistrationNumber(vehicle.getRegistrationNumber())) {
            throw new RuntimeException("Vehicle with registration number " +
                    vehicle.getRegistrationNumber() + " already exists");
        }
        return vehicleRepo.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);

        // Update fields only if provided (non-null)
        Optional.ofNullable(vehicleDetails.getRegistrationNumber())
                .ifPresent(vehicle::setRegistrationNumber);
        Optional.ofNullable(vehicleDetails.getModel())
                .ifPresent(vehicle::setModel);
        Optional.ofNullable(vehicleDetails.getType())
                .ifPresent(vehicle::setType);
        Optional.ofNullable(vehicleDetails.getStatus())
                .ifPresent(vehicle::setStatus);
        Optional.ofNullable(vehicleDetails.getFuelType())
                .ifPresent(vehicle::setFuelType);
        Optional.ofNullable(vehicleDetails.getFuelLevel())
                .ifPresent(vehicle::setFuelLevel);
        Optional.ofNullable(vehicleDetails.getMileage())
                .ifPresent(vehicle::setMileage);
        Optional.ofNullable(vehicleDetails.getAssignedDriver())
                .ifPresent(vehicle::setAssignedDriver);
        Optional.ofNullable(vehicleDetails.getLastServiceDate())
                .ifPresent(vehicle::setLastServiceDate);

        return vehicleRepo.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        if (!vehicleRepo.existsById(id)) {
            throw new RuntimeException("Vehicle not found with id: " + id);
        }
        vehicleRepo.deleteById(id);
    }

    // ==================== Custom Queries ====================

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepo.findByStatus("Available");
    }

    public List<Vehicle> getLowFuelVehicles() {
        return vehicleRepo.findByFuelLevelLessThan(20.0);
    }

    // ==================== Telemetry Update ====================

    public Vehicle updateTelemetry(Long id, TelemetryUpdateDTO telemetry) {
        Vehicle vehicle = getVehicleById(id);

        vehicle.setCurrentSpeed(telemetry.getSpeed());
        vehicle.setFuelLevel(telemetry.getFuelLevel());
        vehicle.setLatitude(telemetry.getLatitude());
        vehicle.setLongitude(telemetry.getLongitude());
        vehicle.setEngineTemperature(telemetry.getEngineTemperature());
        vehicle.setLastTelemetryUpdate(LocalDateTime.now());

        return vehicleRepo.save(vehicle);
    }

    // ==================== Alert System ====================

    public List<String> checkAlerts() {
        List<String> alerts = new ArrayList<>();
        List<Vehicle> vehicles = vehicleRepo.findAll();

        for (Vehicle v : vehicles) {
            if (v.getFuelLevel() != null && v.getFuelLevel() < 20) {
                alerts.add("Low Fuel: " + v.getRegistrationNumber());
            }
            if (v.getEngineTemperature() != null && v.getEngineTemperature() > 90) {
                alerts.add("Overheating: " + v.getRegistrationNumber());
            }
        }
        return alerts;
    }
}