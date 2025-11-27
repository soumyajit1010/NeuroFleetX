// src/main/java/com/soumya/neurofleetx/entity/Vehicle.java
package com.soumya.neurofleetx.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Data
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String licensePlate;
    private String make;
    private String model;

    // REMOVED the wrong @Column name – let Hibernate use the field name
    private Integer manufacturingYear;

    private String vin;

    private String status = "AVAILABLE";

    // Telemetry
    private Double latitude;
    private Double longitude;
    private Double speed;
    private Double fuelLevel;
    private LocalDateTime lastUpdated;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;
}