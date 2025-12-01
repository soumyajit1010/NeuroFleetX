// src/main/java/com/soumya/neurofleetx/repository/RoutePlanRepository.java
package com.soumya.neurofleetx.repository;

import com.soumya.neurofleetx.entity.RoutePlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoutePlanRepository extends JpaRepository<RoutePlan, Long> {
}