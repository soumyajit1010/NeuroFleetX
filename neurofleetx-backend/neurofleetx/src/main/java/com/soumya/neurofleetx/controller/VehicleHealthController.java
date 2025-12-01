package com.soumya.neurofleetx.controller;

import com.soumya.neurofleetx.entity.VehicleHealth;
import com.soumya.neurofleetx.service.PredictionResult;
import com.soumya.neurofleetx.service.VehicleHealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class VehicleHealthController {

    @Autowired
    private VehicleHealthService healthService;

    // GET — fetch health data
    @GetMapping("/{vehicleId}")
    public ResponseEntity<VehicleHealth> getHealth(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(healthService.getOrCreateHealthRecord(vehicleId));
    }

    // PUT — update health metrics
    @PutMapping("/{vehicleId}")
    public ResponseEntity<VehicleHealth> updateHealth(
            @PathVariable Long vehicleId,
            @RequestBody VehicleHealth updates) {

        VehicleHealth updated = healthService.updateHealth(vehicleId, updates);
        return ResponseEntity.ok(updated);
    }

    // GET — health prediction (risk level & days remaining)
    @GetMapping("/{vehicleId}/predict")
    public ResponseEntity<PredictionResult> predict(@PathVariable Long vehicleId) {
        PredictionResult result = healthService.predictMaintenance(vehicleId);
        return ResponseEntity.ok(result);
    }
}
