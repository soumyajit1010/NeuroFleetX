package com.soumya.neurofleetx.service;

import com.soumya.neurofleetx.entity.TelemetryData;
import com.soumya.neurofleetx.entity.Vehicle;
import com.soumya.neurofleetx.repository.TelemetryDataRepository;
import com.soumya.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Basic telemetry storage to support analytics.
 */
@Service
public class TelemetryService {

    @Autowired
    private TelemetryDataRepository telemetryRepo;

    @Autowired
    private VehicleRepository vehicleRepo;

    public TelemetryData addTelemetry(Long vehicleId, TelemetryData payload) {
        Vehicle v = vehicleRepo.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found: " + vehicleId));

        TelemetryData t = new TelemetryData();
        t.setVehicle(v);
        t.setEngineTemp(payload.getEngineTemp());
        t.setFuelLevel(payload.getFuelLevel());
        t.setSpeed(payload.getSpeed());
        t.setGpsLat(payload.getGpsLat());
        t.setGpsLng(payload.getGpsLng());
        t.setTimestamp(payload.getTimestamp() == null ? LocalDateTime.now() : payload.getTimestamp());

        return telemetryRepo.save(t);
    }

    public List<TelemetryData> getTelemetryForVehicle(Long vehicleId) {
        return telemetryRepo.findByVehicleId(vehicleId);
    }

    public TelemetryData getLatestTelemetry(Long vehicleId) {
        return telemetryRepo.findByVehicleId(vehicleId).stream()
                .max((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()))
                .orElse(null);
    }
}
