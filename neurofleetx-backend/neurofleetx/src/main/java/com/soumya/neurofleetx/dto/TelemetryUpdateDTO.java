package com.soumya.neurofleetx.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TelemetryUpdateDTO {

    private Double speed;               // getSpeed()
    private Double fuelLevel;           // getFuelLevel()
    private Double latitude;            // getLatitude()
    private Double longitude;           // getLongitude()
    private Double engineTemperature;   // getEngineTemperature()
}