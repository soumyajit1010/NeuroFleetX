// src/main/java/com/soumya/neurofleetx/entity/DeliveryJob.java
package com.soumya.neurofleetx.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_jobs")
@Data  // ← This gives you ALL getters/setters automatically (no need to write manually)
public class DeliveryJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Customer Info
    private Long customerId;
    private String customerName;
    private String phone;

    // Drop Location (Main Delivery Point)
    private String address;
    private Double latitude;
    private Double longitude;

    // Pickup Location (for return to depot logic)
    private Double pickupLatitude;
    private Double pickupLongitude;

    // Package
    @Column(name = "weight_kg")
    private Double weightKg = 100.0;

    // Assignment (filled by AI optimizer)
    private Long assignedVehicleId;
    private Long assignedDriverId;
    private String assignedVehicleRegNo;
    private Integer sequenceInRoute = 0;

    // Status
    @Column(name = "status", nullable = false)
    private String status = "PENDING";  // PENDING, IN_PROGRESS, COMPLETED, FAILED

    // AI & Business Fields
    @Column(name = "estimated_cost")
    private Double estimatedCost = 0.0;

    @Column(name = "distance_from_depot")
    private Double distanceFromDepot = 0.0;

    // Timestamps
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Link to Route Plan
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_plan_id")
    @JsonBackReference
    private RoutePlan routePlan;

    // Optional: Helper method for status check
    public boolean isCompleted() {
        return "COMPLETED".equalsIgnoreCase(status);
    }
}