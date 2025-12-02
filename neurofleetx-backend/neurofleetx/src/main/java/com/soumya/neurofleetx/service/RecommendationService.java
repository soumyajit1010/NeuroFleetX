package com.soumya.neurofleetx.service;

import com.soumya.neurofleetx.entity.JobRequest;
import com.soumya.neurofleetx.entity.Vehicle;
import com.soumya.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;

@Service
public class RecommendationService {

    @Autowired
    private VehicleRepository vehicleRepo;

    /**
     * Main entry point that builds recommendations for a job request.
     */
    public JobRequest generateRecommendation(JobRequest req) {

        // 1. Calculate estimated distance
        double distance = calculateHaversine(
                req.getPickupLat(), req.getPickupLng(),
                req.getDropLat(), req.getDropLng()
        );
        req.setDistanceKm(distance);

        // 2. Estimate cost (simple formula)
        double cost = estimateCost(distance, req.getPackageWeightKg());
        req.setEstimatedCost(cost);

        // 3. Recommend best vehicle
        Long vehicleId = chooseBestVehicle(req.getPackageWeightKg(), req.getPickupLat(), req.getPickupLng());
        req.setRecommendedVehicleId(vehicleId);

        // 4. Recommended delivery time (smart)
        req.setPreferredTime(suggestOptimalDeliveryTime(req.getPreferredTime()));

        return req;
    }


    // -----------------------------------------------------------------------
    // 1️⃣ Calculate Distance (Haversine)
    // -----------------------------------------------------------------------
    private double calculateHaversine(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371; // Earth radius km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        return 2 * R * Math.asin(Math.sqrt(a));
    }


    // -----------------------------------------------------------------------
    // 2️⃣ Estimate Cost
    // -----------------------------------------------------------------------
    private double estimateCost(double distanceKm, double weightKg) {
        double baseFare = 50;
        double distFare = distanceKm * 12;    // ₹12 per km
        double weightCharge = weightKg > 200 ? (weightKg - 200) * 0.5 : 0;

        return baseFare + distFare + weightCharge;
    }


    // -----------------------------------------------------------------------
    // 3️⃣ Choose Best Vehicle (simple rules)
    // -----------------------------------------------------------------------
    public Long chooseBestVehicle(double weightKg, double pickupLat, double pickupLng) {
        List<Vehicle> vehicles = vehicleRepo.findAll();
        if (vehicles.isEmpty()) return null;

        // Filter by weight capability (simple assumption)
        List<Vehicle> capableVehicles = vehicles.stream()
                .filter(v -> !"UNAVAILABLE".equalsIgnoreCase(v.getStatus()))
                .toList();

        if (capableVehicles.isEmpty()) return null;

        // Pick closest available vehicle
        Vehicle best = capableVehicles.stream()
                .min(Comparator.comparingDouble(
                        v -> calculateHaversine(
                                v.getLatitude() == null ? pickupLat : v.getLatitude(),
                                v.getLongitude() == null ? pickupLng : v.getLongitude(),
                                pickupLat, pickupLng
                        )
                )).orElse(null);

        return best != null ? best.getId() : null;
    }


    // -----------------------------------------------------------------------
    // 4️⃣ Suggest Delivery Time (Smart Scheduling)
    // -----------------------------------------------------------------------
    private LocalDateTime suggestOptimalDeliveryTime(LocalDateTime preferred) {
        if (preferred == null) {
            return LocalDateTime.now().plusHours(2); // default 2 hours later
        }

        // Avoid peak hours (5pm–9pm)
        LocalTime time = preferred.toLocalTime();

        if (time.isAfter(LocalTime.of(17, 0)) && time.isBefore(LocalTime.of(21, 0))) {
            return preferred.plusHours(1); // shift by 1 hr due to traffic
        }

        return preferred;
    }
}
