// src/main/java/com/soumya/neurofleetx/repository/DeliveryJobRepository.java

package com.soumya.neurofleetx.repository;

import com.soumya.neurofleetx.entity.DeliveryJob;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryJobRepository extends JpaRepository<DeliveryJob, Long> {

    List<DeliveryJob> findByRoutePlanIsNull();

    List<DeliveryJob> findByRoutePlanId(Long routePlanId);

    List<DeliveryJob> findByRoutePlanIdAndAssignedVehicleId(Long routePlanId, Long vehicleId);

    // THIS LINE WAS MISSING — ADD IT NOW!
    List<DeliveryJob> findByAssignedDriverId(Long driverId);
}