package com.soumya.neurofleetx.repository;

import com.soumya.neurofleetx.entity.DeliveryJob;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryJobRepository extends JpaRepository<DeliveryJob, Long> {

    // Find jobs by plan id
    List<DeliveryJob> findByRoutePlanId(Long routePlanId);

    // Find jobs for a specific plan & assigned vehicle (vehicle route)
    List<DeliveryJob> findByRoutePlanIdAndAssignedVehicleId(Long routePlanId, Long assignedVehicleId);
}
