package com.soumya.neurofleetx.dto;

public record DeliveryJobDTO(
        Long id,
        String customerName,
        String address,
        String phone,
        Double latitude,
        Double longitude,
        Integer sequenceInRoute,
        Double weightKg,
        Long assignedDriverId,
        Long assignedVehicleId,
        String assignedVehicleRegNo
) {}
