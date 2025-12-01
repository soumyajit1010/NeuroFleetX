package com.soumya.neurofleetx.controller;

import com.soumya.neurofleetx.entity.TelemetryData;
import com.soumya.neurofleetx.service.TelemetryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/telemetry")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TelemetryController {

    @Autowired
    private TelemetryService telemetryService;

    // POST — add telemetry packet
    @PostMapping("/{vehicleId}")
    public ResponseEntity<TelemetryData> addTelemetry(
            @PathVariable Long vehicleId,
            @RequestBody TelemetryData payload) {

        TelemetryData saved = telemetryService.addTelemetry(vehicleId, payload);
        return ResponseEntity.ok(saved);
    }

    // GET — full telemetry list
    @GetMapping("/{vehicleId}")
    public ResponseEntity<List<TelemetryData>> getTelemetry(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(telemetryService.getTelemetryForVehicle(vehicleId));
    }

    // GET — latest telemetry record only
    @GetMapping("/{vehicleId}/latest")
    public ResponseEntity<TelemetryData> getLatestTelemetry(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(telemetryService.getLatestTelemetry(vehicleId));
    }
}
