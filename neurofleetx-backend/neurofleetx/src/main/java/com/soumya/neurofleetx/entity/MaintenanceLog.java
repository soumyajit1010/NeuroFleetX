package com.soumya.neurofleetx.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "maintenance_logs")
public class MaintenanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign key to Vehicle
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    private LocalDate serviceDate;

    private String serviceType;

    private Double cost;

    private String mechanicName;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDate nextDueDate;
}
