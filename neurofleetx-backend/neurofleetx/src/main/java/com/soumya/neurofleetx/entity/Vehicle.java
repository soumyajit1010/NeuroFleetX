package com.soumya.neurofleetx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String registrationNumber;

    private String model;
    private String type; // Truck, Van, Car, etc.
    private String status; // Available, In Use, Under Maintenance, Reserved
    private String fuelType; // Petrol, Diesel, Electric, CNG
    private Double fuelLevel; // 0 to 100 (%)
    private Double mileage; // km/l or kWh/100km
    private String assignedDriver; // Can be Driver ID or Name
    private LocalDate lastServiceDate;

    // Telemetry Fields (Live Data)
    private Double currentSpeed; // km/h
    private Double latitude;
    private Double longitude;
    private Double engineTemperature; // °C
    private LocalDateTime lastTelemetryUpdate;
}