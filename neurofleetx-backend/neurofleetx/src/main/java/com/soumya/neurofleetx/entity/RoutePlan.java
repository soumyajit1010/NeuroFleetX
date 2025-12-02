package com.soumya.neurofleetx.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "route_plans")
@Data
public class RoutePlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime createdAt = LocalDateTime.now();
    private int numberOfVehicles;
    private double totalDistanceKm;
    private int estimatedTimeMinutes;

    @OneToMany(mappedBy = "routePlan", cascade = CascadeType.ALL, fetch = FetchType.LAZY) // Changed to LAZY
    @JsonManagedReference
    @JsonInclude(JsonInclude.Include.NON_NULL) // Ensure jobs is included if not null
    private List<DeliveryJob> jobs = new ArrayList<>();
}