package com.soumya.neurofleetx.repository;

import com.soumya.neurofleetx.entity.TelemetryData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TelemetryDataRepository extends JpaRepository<TelemetryData, Long> {
    List<TelemetryData> findByVehicleId(Long vehicleId);
}
