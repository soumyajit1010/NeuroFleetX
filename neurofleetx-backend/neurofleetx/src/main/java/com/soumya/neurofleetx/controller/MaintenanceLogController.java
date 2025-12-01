package com.soumya.neurofleetx.controller;

import com.soumya.neurofleetx.entity.MaintenanceLog;
import com.soumya.neurofleetx.service.MaintenanceLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MaintenanceLogController {

    @Autowired
    private MaintenanceLogService logService;

    // GET — all logs for vehicle
    @GetMapping("/{vehicleId}")
    public ResponseEntity<List<MaintenanceLog>> getLogs(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(logService.getLogsForVehicle(vehicleId));
    }

    // POST — add new log
    @PostMapping("/{vehicleId}")
    public ResponseEntity<MaintenanceLog> addLog(
            @PathVariable Long vehicleId,
            @RequestBody MaintenanceLog payload) {

        MaintenanceLog saved = logService.addMaintenanceLog(vehicleId, payload);
        return ResponseEntity.ok(saved);
    }

    // DELETE — delete maintenance log
    @DeleteMapping("/{logId}")
    public ResponseEntity<String> deleteLog(@PathVariable Long logId) {
        logService.deleteLog(logId);
        return ResponseEntity.ok("Maintenance log deleted");
    }
}
