// src/main/java/com/soumya/neurofleetx/entity/DeliveryJob.java
package com.soumya.neurofleetx.entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "delivery_jobs")
@Data
public class DeliveryJob {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String phone;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double weightKg = 100.0;

    private Long assignedVehicleId;
    private Integer sequenceInRoute;

    // ADD THESE TWO
    private Long assignedDriverId;
    private String assignedVehicleRegNo;

    @ManyToOne
    @JoinColumn(name = "route_plan_id")
    @JsonBackReference          // ADD THIS LINE
    private RoutePlan routePlan;
}