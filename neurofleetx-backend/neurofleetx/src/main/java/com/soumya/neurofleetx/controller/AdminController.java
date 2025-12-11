// src/main/java/com/soumya/neurofleetx/controller/AdminController.java
package com.soumya.neurofleetx.controller;

import com.soumya.neurofleetx.entity.DeliveryJob;
import com.soumya.neurofleetx.repository.DeliveryJobRepository;
import com.soumya.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    @Autowired private DeliveryJobRepository jobRepo;
    @Autowired private VehicleRepository vehicleRepo;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        List<DeliveryJob> todayJobs = jobRepo.findByCreatedAtBetween(start, end);

        long completed = todayJobs.stream()
                .filter(j -> "COMPLETED".equalsIgnoreCase(j.getStatus()))
                .count();

        double onTimeRate = todayJobs.isEmpty() ? 0 : (completed * 100.0 / todayJobs.size());

        double totalRevenue = todayJobs.stream()
                .mapToDouble(j -> j.getEstimatedCost() != null ? j.getEstimatedCost() : 0.0)
                .sum();

        double totalDistance = todayJobs.stream()
                .mapToDouble(j -> j.getDistanceFromDepot() != null ? j.getDistanceFromDepot() : 0.0)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("activeVehicles", vehicleRepo.count());
        stats.put("deliveriesToday", todayJobs.size());
        stats.put("onTimeRate", Math.round(onTimeRate * 10) / 10.0);
        stats.put("revenue", Math.round(totalRevenue));
        stats.put("carbonSaved", Math.round(totalDistance * 0.4) / 1000.0); // tons
        return stats;
    }

    @GetMapping("/heatmap")
    public List<DeliveryJob> getHeatmapData() {
        return jobRepo.findAll();
    }

    @GetMapping("/top-drivers")
    public List<Map<String, Object>> getTopDrivers() {
        Map<Long, Long> countMap = new HashMap<>();
        jobRepo.findAll().forEach(job -> {
            if (job.getAssignedDriverId() != null) {
                countMap.merge(job.getAssignedDriverId(), 1L, Long::sum);
            }
        });
        return countMap.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", e.getKey());
                    m.put("name", "Driver " + e.getKey());
                    m.put("completed", e.getValue());
                    return m;
                })
                .toList();
    }
}