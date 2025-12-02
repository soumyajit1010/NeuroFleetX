package com.soumya.neurofleetx.controller;

import com.soumya.neurofleetx.entity.DeliveryJob;
import com.soumya.neurofleetx.entity.JobRequest;
import com.soumya.neurofleetx.repository.DeliveryJobRepository;
import com.soumya.neurofleetx.repository.JobRequestRepository;
import com.soumya.neurofleetx.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class JobRequestController {

    @Autowired
    private JobRequestRepository jobRepo;

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private DeliveryJobRepository deliveryRepo;

    // 1. Customer creates a booking — AI Recommendation Applied
    @PostMapping("")
    public ResponseEntity<JobRequest> createBooking(@RequestBody JobRequest req) {
        recommendationService.generateRecommendation(req);
        req.setStatus("NEW");
        JobRequest saved = jobRepo.save(req);
        return ResponseEntity.ok(saved);
    }

    // 2. Get all bookings for a particular customer
    @GetMapping("/customer/{customerId}")
    public List<JobRequest> getCustomerBookings(@PathVariable Long customerId) {
        return jobRepo.findByCustomerId(customerId);
    }

    // 3. Fleet Manager sees all NEW pending booking requests
    @GetMapping("/pending")
    public List<JobRequest> getPendingBookings() {
        return jobRepo.findByStatus("NEW");
    }

    // 4. Reject Booking
    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectBooking(@PathVariable Long id) {
        JobRequest req = jobRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"NEW".equals(req.getStatus())) {
            return ResponseEntity.badRequest().body("Booking already processed.");
        }

        req.setStatus("REJECTED");
        jobRepo.save(req);
        return ResponseEntity.ok("Booking rejected successfully.");
    }

    // 5. Get pending (unplanned) DeliveryJobs — used by AI Optimizer
    @GetMapping("/pending-jobs")
    public List<DeliveryJob> getPendingJobs() {
        return deliveryRepo.findByRoutePlanIsNull();
    }

    @Transactional
    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveBooking(@PathVariable Long id) {

        JobRequest req = jobRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"NEW".equals(req.getStatus())) {
            return ResponseEntity.badRequest().body("Booking already processed.");
        }

        DeliveryJob job = new DeliveryJob();

        // MUST SET THESE 4 COORDINATES — THIS WAS MISSING!
        job.setLatitude(req.getDropLat());
        job.setLongitude(req.getDropLng());
        job.setPickupLatitude(req.getPickupLat());      // THIS WAS NULL!
        job.setPickupLongitude(req.getPickupLng());      // THIS WAS NULL!

        // Other fields
        job.setCustomerId(req.getCustomerId());
        job.setCustomerName("Customer #" + req.getCustomerId());
        job.setPhone("N/A");
        job.setAddress(req.getDropAddress());
        job.setWeightKg(req.getPackageWeightKg());
        job.setEstimatedCost(req.getEstimatedCost());
        job.setAssignedVehicleId(req.getRecommendedVehicleId());

        job.setStatus("PENDING");
        job.setSequenceInRoute(0);
        job.setRoutePlan(null);

        deliveryRepo.save(job);

        req.setStatus("APPROVED");
        jobRepo.save(req);

        return ResponseEntity.ok("Booking approved → ready for AI Optimizer!");
    }
}