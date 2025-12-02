// src/main/java/com/soumya/neurofleetx/entity/DeliveryJob.java
package com.soumya.neurofleetx.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "delivery_jobs")
@Data
public class DeliveryJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Customer Info
    private Long customerId;                    // NEW: Track who booked
    private String customerName;
    private String phone;

    // Drop Location (Main Delivery Point)
    private String address;
    private Double latitude;
    private Double longitude;

    // Pickup Location — CRITICAL FOR RETURN TO DEPOT!
    private Double pickupLatitude;
    private Double pickupLongitude;

    // Package
    private Double weightKg = 100.0;

    // Assignment (filled by AI optimizer)
    private Long assignedVehicleId;
    private Long assignedDriverId;
    private String assignedVehicleRegNo;
    private Integer sequenceInRoute = 0;

    // Status
    private String status = "PENDING";

    // Optional AI fields
    private Double estimatedCost;

    // Link to Route Plan
    @ManyToOne
    @JoinColumn(name = "route_plan_id")
    @JsonBackReference
    private RoutePlan routePlan;
}