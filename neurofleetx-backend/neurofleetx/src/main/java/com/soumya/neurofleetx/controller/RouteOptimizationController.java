package com.soumya.neurofleetx.controller;

import com.soumya.neurofleetx.dto.DeliveryJobDTO;
import com.soumya.neurofleetx.dto.RoutePlanDTO;
import com.soumya.neurofleetx.entity.DeliveryJob;
import com.soumya.neurofleetx.entity.RoutePlan;
import com.soumya.neurofleetx.entity.User;
import com.soumya.neurofleetx.entity.Vehicle;
import com.soumya.neurofleetx.repository.DeliveryJobRepository;
import com.soumya.neurofleetx.repository.RoutePlanRepository;
import com.soumya.neurofleetx.repository.UserRepository;
import com.soumya.neurofleetx.service.RouteOptimizationService;
import com.soumya.neurofleetx.service.VehicleService;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/optimize")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RouteOptimizationController {

    @Autowired
    private RouteOptimizationService optimizer;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private RoutePlanRepository planRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private DeliveryJobRepository deliveryRepo;

    // 1️⃣ CREATE OPTIMIZED PLAN
    @PostMapping("")
    @Transactional
    public ResponseEntity<RoutePlan> createOptimizedPlan(
            @RequestBody List<Map<String, Object>> jobDataList,
            @RequestParam(defaultValue = "5") int maxVehicles) {

        if (jobDataList == null || jobDataList.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        List<DeliveryJob> jobs = new ArrayList<>();
        for (Map<String, Object> data : jobDataList) {
            Long id = Long.valueOf(data.get("id").toString());
            DeliveryJob job = deliveryRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Job not found: " + id));

            job.setLatitude((Double) data.get("latitude"));
            job.setLongitude((Double) data.get("longitude"));
            job.setWeightKg(((Number) data.get("weightKg")).doubleValue());
            jobs.add(job);
        }

        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        int effectiveMaxVehicles = Math.min(maxVehicles, Math.max(1, vehicles.size()));

        RoutePlan plan = optimizer.optimize(jobs, vehicles, effectiveMaxVehicles);
        plan.getJobs().forEach(job -> job.setRoutePlan(plan));
        RoutePlan saved = planRepo.save(plan);
        Hibernate.initialize(saved.getJobs());

        return ResponseEntity.ok(saved);
    }

    // 2️⃣ GET ALL PLANS (for RouteHistory)
    @GetMapping("/plans")
    public List<RoutePlanDTO> getAllPlans() {
        List<RoutePlan> plans = planRepo.findAll();
        plans.forEach(plan -> Hibernate.initialize(plan.getJobs())); // Ensure jobs are loaded
        return plans.stream()
                .map(plan -> new RoutePlanDTO(
                        plan.getId(),
                        plan.getCreatedAt(),
                        plan.getNumberOfVehicles(),
                        plan.getTotalDistanceKm(),
                        plan.getEstimatedTimeMinutes(),
                        plan.getJobs().stream()
                                .map(job -> new DeliveryJobDTO(
                                        job.getId(),
                                        job.getCustomerName(),
                                        job.getAddress(),
                                        job.getPhone(),
                                        job.getLatitude(),
                                        job.getLongitude(),
                                        job.getSequenceInRoute(),
                                        job.getWeightKg(),
                                        job.getAssignedDriverId(),
                                        job.getAssignedVehicleId(),
                                        job.getAssignedVehicleRegNo()
                                )).collect(Collectors.toList())
                )).collect(Collectors.toList());
    }

    // 3️⃣ ASSIGN DRIVER
    @PutMapping("/plans/{planId}/routes/{vehicleId}/assign")
    @Transactional
    public ResponseEntity<String> assignDriverToVehicleRoute(
            @PathVariable Long planId,
            @PathVariable Long vehicleId,
            @RequestBody Map<String, Long> body) {

        Long driverId = body.get("driverId");
        if (driverId == null)
            return ResponseEntity.badRequest().body("driverId must be provided.");

        RoutePlan plan = planRepo.findById(planId)
                .orElseThrow(() -> new RuntimeException("Route Plan not found"));

        List<DeliveryJob> routeJobs =
                deliveryRepo.findByRoutePlanIdAndAssignedVehicleId(planId, vehicleId);

        if (routeJobs.isEmpty())
            return ResponseEntity.badRequest().body("No jobs found for this route.");

        boolean alreadyAssigned = routeJobs.stream()
                .anyMatch(j -> j.getAssignedDriverId() != null);

        if (alreadyAssigned)
            return ResponseEntity.badRequest().body("This route already has a driver.");

        User driver = userRepo.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (driver.getRole() != User.Role.Driver)
            return ResponseEntity.badRequest().body("Selected user is not a valid Driver.");

        Vehicle vehicle = vehicleService.getVehicleById(vehicleId);

        for (DeliveryJob j : routeJobs) {
            j.setAssignedDriverId(driverId);
            deliveryRepo.save(j);
        }

        return ResponseEntity.ok(
                "Driver " + driver.getName() + " assigned to vehicle "
                        + vehicle.getLicensePlate() + " in plan #" + planId
        );
    }

    // 4️⃣ GET ALL PLANS WITH JOBS — FOR RoutePlans PAGE
    // IN RouteOptimizationController.java → REPLACE THIS METHOD ONLY
    @GetMapping("/route-plans/all")
    @Transactional(readOnly = true)
    public ResponseEntity<List<RoutePlan>> getAllPlansWithJobs() {
        try {
            // 1. Get all plans sorted by ID descending
            List<RoutePlan> plans = planRepo.findAll(Sort.by(Sort.Direction.DESC, "id"));

            // 2. For EACH plan, FORCE LOAD the jobs (this is the key!)
            for (RoutePlan plan : plans) {
                Hibernate.initialize(plan.getJobs());
                // Extra safety: reload jobs from DB
                List<DeliveryJob> jobs = deliveryRepo.findByRoutePlanId(plan.getId());
                plan.setJobs(jobs);
            }

            System.out.println("Returning " + plans.size() + " plans with jobs");
            return ResponseEntity.ok(plans);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>()); // Never crash
        }
    }
}