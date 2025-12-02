package com.soumya.neurofleetx.repository;

import com.soumya.neurofleetx.entity.JobRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRequestRepository extends JpaRepository<JobRequest, Long> {

    // Get bookings for a specific customer
    List<JobRequest> findByCustomerId(Long customerId);

    // For fleet manager to see only NEW requests
    List<JobRequest> findByStatus(String status);
}
