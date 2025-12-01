package com.soumya.neurofleetx.repository;

import com.soumya.neurofleetx.entity.VehicleHealth;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleHealthRepository extends JpaRepository<VehicleHealth, Long> {
}
