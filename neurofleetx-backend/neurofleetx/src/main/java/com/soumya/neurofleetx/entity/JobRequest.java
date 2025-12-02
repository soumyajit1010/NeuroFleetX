package com.soumya.neurofleetx.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_requests")
@Data
public class JobRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which customer created the booking
    private Long customerId;

    // Pickup details
    private String pickupAddress;
    private Double pickupLat;
    private Double pickupLng;

    // Drop details
    private String dropAddress;
    private Double dropLat;
    private Double dropLng;

    // Package weight
    private Double packageWeightKg;

    // Customer preferred time slot
    private LocalDateTime preferredTime;

    /**
     * Status of request:
     * NEW, APPROVED, REJECTED, SCHEDULED, COMPLETED
     */
    private String status = "NEW";

    // Smart recommendations
    private Long recommendedVehicleId;
    private Double distanceKm;
    private Double estimatedCost;

    private LocalDateTime createdAt = LocalDateTime.now();
}
