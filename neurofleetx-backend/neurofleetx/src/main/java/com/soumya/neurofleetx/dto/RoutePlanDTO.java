// src/main/java/com/soumya/neurofleetx/dto/RoutePlanDTO.java
package com.soumya.neurofleetx.dto;

import java.time.LocalDateTime;
import java.util.List;

public record RoutePlanDTO(
    Long id,
    LocalDateTime createdAt,
    int numberOfVehicles,
    double totalDistanceKm,
    int estimatedTimeMinutes,
    List<DeliveryJobDTO> jobs
) {}

