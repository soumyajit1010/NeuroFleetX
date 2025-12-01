package com.soumya.neurofleetx.service;

import com.soumya.neurofleetx.entity.Vehicle;
import com.soumya.neurofleetx.entity.VehicleHealth;
import com.soumya.neurofleetx.repository.VehicleHealthRepository;
import com.soumya.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

/**
 * Manages vehicle health records and provides health-calculation helpers.
 */
@Service
public class VehicleHealthService {

    @Autowired
    private VehicleHealthRepository healthRepo;

    @Autowired
    private VehicleRepository vehicleRepo;

    /**
     * Return VehicleHealth if exists, otherwise initialize a default record and return it.
     */
    @Transactional
    public VehicleHealth getOrCreateHealthRecord(Long vehicleId) {
        Optional<VehicleHealth> existing = healthRepo.findById(vehicleId);
        if (existing.isPresent()) return existing.get();

        Vehicle vehicle = vehicleRepo.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found: " + vehicleId));

        VehicleHealth h = new VehicleHealth();
        h.setVehicle(vehicle);
        h.setVehicleId(vehicle.getId());
        h.setEngineHealth(100);
        h.setBatteryHealth(100);
        h.setTyreHealth(100);
        h.setBrakeHealth(100);
        h.setMileageKm(0);
        h.setOverallHealth(100);
        h.setLastServiceDate(null);
        h.setNextServiceDate(null);

        return healthRepo.save(h);
    }

    public VehicleHealth getHealth(Long vehicleId) {
        return healthRepo.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("VehicleHealth not found for vehicle: " + vehicleId));
    }

    /**
     * Update health fields and recalculate overall health.
     * Only non-null incoming fields will be applied.
     */
    @Transactional
    public VehicleHealth updateHealth(Long vehicleId, VehicleHealth updates) {
        VehicleHealth h = getOrCreateHealthRecord(vehicleId);

        if (updates.getEngineHealth() != null) h.setEngineHealth(clamp(updates.getEngineHealth()));
        if (updates.getBatteryHealth() != null) h.setBatteryHealth(clamp(updates.getBatteryHealth()));
        if (updates.getTyreHealth() != null) h.setTyreHealth(clamp(updates.getTyreHealth()));
        if (updates.getBrakeHealth() != null) h.setBrakeHealth(clamp(updates.getBrakeHealth()));
        if (updates.getMileageKm() != null) h.setMileageKm(updates.getMileageKm());
        if (updates.getLastServiceDate() != null) h.setLastServiceDate(updates.getLastServiceDate());
        if (updates.getNextServiceDate() != null) h.setNextServiceDate(updates.getNextServiceDate());

        // Recompute overall using weighted average (weights can be tuned)
        int overall = calculateOverallHealth(h);
        h.setOverallHealth(overall);

        return healthRepo.save(h);
    }

    /**
     * Recalculate overall health using weights.
     * You may tune weights or replace with ML model later.
     */
    public int calculateOverallHealth(VehicleHealth h) {
        double wEngine = 0.40;
        double wTyre = 0.25;
        double wBattery = 0.20;
        double wBrake = 0.15;

        double engine = h.getEngineHealth() == null ? 100 : h.getEngineHealth();
        double tyre = h.getTyreHealth() == null ? 100 : h.getTyreHealth();
        double battery = h.getBatteryHealth() == null ? 100 : h.getBatteryHealth();
        double brake = h.getBrakeHealth() == null ? 100 : h.getBrakeHealth();

        double overall = engine * wEngine + tyre * wTyre + battery * wBattery + brake * wBrake;
        int o = (int) Math.round(Math.max(0, Math.min(100, overall)));
        return o;
    }

    private Integer clamp(Integer v) {
        if (v == null) return null;
        if (v < 0) return 0;
        if (v > 100) return 100;
        return v;
    }


    /**
     * Simple prediction: returns risk level + estimated days until failure.
     * - overall < 50 => HIGH risk (10-20 days)
     * - 50 <= overall < 75 => MEDIUM (30-60 days)
     * - overall >= 75 => LOW (60-120 days)
     */
    public PredictionResult predictMaintenance(Long vehicleId) {
        VehicleHealth h = getOrCreateHealthRecord(vehicleId);
        int overall = h.getOverallHealth() == null ? 100 : h.getOverallHealth();

        if (overall < 50) {
            return new PredictionResult("HIGH", Math.max(1, 10 + (int)(Math.random() * 10)), overall);
        } else if (overall < 75) {
            return new PredictionResult("MEDIUM", 30 + (int)(Math.random() * 30), overall);
        } else {
            return new PredictionResult("LOW", 60 + (int)(Math.random() * 61), overall);
        }
    }

}
