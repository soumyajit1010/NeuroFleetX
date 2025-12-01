package com.soumya.neurofleetx.controller;

import com.soumya.neurofleetx.dto.DeliveryJobDTO;
import com.soumya.neurofleetx.dto.DeliveryJobRequest;
import com.soumya.neurofleetx.dto.RoutePlanDTO;
import com.soumya.neurofleetx.entity.DeliveryJob;
import com.soumya.neurofleetx.entity.RoutePlan;
import com.soumya.neurofleetx.entity.User;
import com.soumya.neurofleetx.entity.Vehicle;
import com.soumya.neurofleetx.repository.RoutePlanRepository;
import com.soumya.neurofleetx.repository.UserRepository;
import com.soumya.neurofleetx.repository.DeliveryJobRepository;
import com.soumya.neurofleetx.service.RouteOptimizationService;
import com.soumya.neurofleetx.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("")
    @Transactional
    public ResponseEntity<RoutePlanDTO> createOptimizedPlan(
            @RequestBody List<DeliveryJobRequest> jobRequests,
            @RequestParam(defaultValue = "5") int maxVehicles) {

        List<DeliveryJob> jobs = jobRequests.stream().map(req -> {
            DeliveryJob j = new DeliveryJob();
            j.setCustomerName(req.getCustomerName());
            j.setPhone(req.getPhone());
            j.setAddress(req.getAddress());
            j.setLatitude(req.getLatitude());
            j.setLongitude(req.getLongitude());
            j.setWeightKg(req.getWeightKg() == null ? 0.0 : req.getWeightKg());
            return j;
        }).collect(Collectors.toList());

        boolean anyMissing = jobs.stream()
                .anyMatch(j -> j.getLatitude() == null || j.getLongitude() == null);
        if (anyMissing) {
            return ResponseEntity.badRequest().body(null);
        }

        // Get all available vehicles from DB
        List<Vehicle> vehicles = vehicleService.getAllVehicles();

        // Clamp maxVehicles to the number of available vehicles (can't use more vehicles than exist)
        int effectiveMaxVehicles = Math.max(1, Math.min(maxVehicles, Math.max(1, vehicles.size())));

        // Call optimizer with the effectiveMaxVehicles
        RoutePlan plan = optimizer.optimize(jobs, vehicles, effectiveMaxVehicles);

        // Fix: ensure numberOfVehicles reflects what optimizer actually produced
        int actualVehiclesUsed = plan.getJobs().stream()
                .map(DeliveryJob::getAssignedVehicleId)
                .filter(vid -> vid != null)
                .collect(Collectors.groupingBy(v -> v))
                .size();

        // If optimizer sets numberOfVehicles internally, keep it; else set the calculated value
        plan.setNumberOfVehicles(Math.max(plan.getNumberOfVehicles(), actualVehiclesUsed));

        // Link jobs -> plan so JPA persists route_plan_id
        plan.getJobs().forEach(job -> job.setRoutePlan(plan));

        RoutePlan saved = planRepo.save(plan);

        RoutePlanDTO dto = new RoutePlanDTO(
                saved.getId(),
                saved.getCreatedAt(),
                saved.getNumberOfVehicles(),
                saved.getTotalDistanceKm(),
                saved.getEstimatedTimeMinutes(),
                saved.getJobs().stream()
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
                        ))
                        .collect(Collectors.toList())
        );

        return ResponseEntity.ok(dto);
    }


    // Return all plans as DTOs
    @GetMapping("/plans")
    public List<RoutePlanDTO> getAllPlans() {
        return planRepo.findAll().stream()
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

    /**
     * NEW: Assign a driver to a specific vehicle-route inside a plan.
     * This assigns only those jobs in plan where assignedVehicleId == vehicleId.
     *
     * PUT /api/optimize/plans/{planId}/routes/{vehicleId}/assign
     * Body: { "driverId": 5 }
     */
    @PutMapping("/plans/{planId}/routes/{vehicleId}/assign")
    @Transactional
    public ResponseEntity<String> assignDriverToVehicleRoute(
            @PathVariable Long planId,
            @PathVariable Long vehicleId,
            @RequestBody Map<String, Long> request) {

        Long driverId = request.get("driverId");
        if (driverId == null) {
            return ResponseEntity.badRequest().body("driverId must be provided.");
        }

        RoutePlan plan = planRepo.findById(planId)
                .orElseThrow(() -> new RuntimeException("Route Plan not found"));

        // Find jobs belonging to this plan & this vehicle route
        List<DeliveryJob> routeJobs = deliveryRepo.findByRoutePlanIdAndAssignedVehicleId(planId, vehicleId);

        if (routeJobs == null || routeJobs.isEmpty()) {
            return ResponseEntity.badRequest().body("No jobs found for this plan / vehicle route.");
        }

        // Check if already assigned (fresh DB data)
        boolean alreadyAssigned = routeJobs.stream()
                .anyMatch(j -> j.getAssignedDriverId() != null);
        if (alreadyAssigned) {
            return ResponseEntity.badRequest().body("This vehicle route is already assigned to a driver.");
        }

        User driver = userRepo.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (driver.getRole() != User.Role.Driver) {
            return ResponseEntity.badRequest().body("Selected user is not a Driver.");
        }

        // Validate vehicle exists (vehicleId used in job.assignedVehicleId)
        Vehicle vehicle = vehicleService.getVehicleById(vehicleId);

        // Assign driver to those jobs and save individually
        for (DeliveryJob job : routeJobs) {
            job.setAssignedDriverId(driverId);
            deliveryRepo.save(job);
        }

        return ResponseEntity.ok("Assigned driver " + driver.getName() + " to vehicle-route " + vehicleId + " in plan #" + planId);
    }
}
