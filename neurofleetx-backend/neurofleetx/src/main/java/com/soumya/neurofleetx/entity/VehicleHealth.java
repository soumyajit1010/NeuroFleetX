package com.soumya.neurofleetx.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "vehicle_health")
public class VehicleHealth {

    @Id
    @Column(name = "vehicle_id")
    private Long vehicleId; // Primary Key = Vehicle ID

    @OneToOne
    @MapsId
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    private Integer engineHealth;
    private Integer batteryHealth;
    private Integer tyreHealth;
    private Integer brakeHealth;

    private Integer mileageKm;

    private LocalDate lastServiceDate;
    private LocalDate nextServiceDate;

    private Integer overallHealth;
}
