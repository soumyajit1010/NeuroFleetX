// src/main/java/com/soumya/neurofleetx/repository/VehicleRepository.java
package com.soumya.neurofleetx.repository;

import com.soumya.neurofleetx.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByDriverId(Long driverId);
}