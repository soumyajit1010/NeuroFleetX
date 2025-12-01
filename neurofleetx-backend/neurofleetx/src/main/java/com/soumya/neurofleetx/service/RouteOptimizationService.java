package com.soumya.neurofleetx.service;

import com.soumya.neurofleetx.entity.DeliveryJob;
import com.soumya.neurofleetx.entity.RoutePlan;
import com.soumya.neurofleetx.entity.Vehicle;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
public class RouteOptimizationService {

    private static final double DEPOT_LAT = 19.0760;  // Mumbai
    private static final double DEPOT_LNG = 72.8777;
    private static final double DEFAULT_VEHICLE_CAPACITY_KG = 1000.0;
    private static final double AVERAGE_SPEED_KMH = 35.0; // used for ETA calculation

    /**
     * Optimize delivering jobs across available vehicles (greedy + 2-opt improvement).
     *
     * @param jobs              list of DeliveryJob (must contain lat/lng)
     * @param availableVehicles list of vehicles (may be empty)
     * @param maxVehicles       maximum vehicles allowed
     * @return RoutePlan with assigned jobs (jobs have assignedVehicleId, assignedVehicleRegNo, sequence)
     */
    public RoutePlan optimize(List<DeliveryJob> jobs, List<Vehicle> availableVehicles, int maxVehicles) {
        // Basic validation
        if (jobs == null) jobs = Collections.emptyList();
        List<DeliveryJob> inputJobs = new ArrayList<>();
        for (DeliveryJob j : jobs) {
            if (j == null) continue;
            // Defensive defaults
            if (j.getLatitude() == null || j.getLongitude() == null) {
                throw new IllegalArgumentException("Each job must include latitude and longitude: missing for " + j.getCustomerName());
            }
            if (j.getWeightKg() == null) j.setWeightKg(0.0);
            inputJobs.add(j);
        }

        // Build points list with depot at start and end
        List<DeliveryJob> allPoints = new ArrayList<>();
        DeliveryJob depot = new DeliveryJob();
        depot.setId(0L);
        depot.setLatitude(DEPOT_LAT);
        depot.setLongitude(DEPOT_LNG);
        depot.setCustomerName("DEPOT");
        depot.setWeightKg(0.0);
        allPoints.add(depot);
        allPoints.addAll(inputJobs);
        allPoints.add(depot); // return to depot index = n-1

        int n = allPoints.size();
        double[][] dist = new double[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) dist[i][j] = 0;
                else dist[i][j] = haversine(
                        allPoints.get(i).getLatitude(), allPoints.get(i).getLongitude(),
                        allPoints.get(j).getLatitude(), allPoints.get(j).getLongitude()
                );
            }
        }

        // unvisited indices: 1 .. n-2
        List<Integer> unvisited = new ArrayList<>();
        for (int i = 1; i < n - 1; i++) unvisited.add(i);

        List<List<Integer>> routes = new ArrayList<>();
        int vehicleCount = 0;

        while (!unvisited.isEmpty() && vehicleCount < Math.max(1, Math.min(maxVehicles, Math.max(1, availableVehicles.size() == 0 ? maxVehicles : availableVehicles.size())))) {
            List<Integer> route = new ArrayList<>();
            route.add(0); // start depot
            double currentLoad = 0.0;
            double capacity = (availableVehicles.size() > vehicleCount && availableVehicles.get(vehicleCount) != null)
                    ? OptionalVehicleCapacity(availableVehicles.get(vehicleCount))
                    : DEFAULT_VEHICLE_CAPACITY_KG;

            // Greedy nearest neighbor subject to capacity
            while (!unvisited.isEmpty()) {
                int current = route.get(route.size() - 1);
                int best = -1;
                double bestDist = Double.MAX_VALUE;
                for (int next : new ArrayList<>(unvisited)) {
                    double loadAfter = currentLoad + getSafeWeight(allPoints.get(next));
                    if (loadAfter <= capacity && dist[current][next] < bestDist) {
                        bestDist = dist[current][next];
                        best = next;
                    }
                }
                if (best == -1) break;
                route.add(best);
                currentLoad += getSafeWeight(allPoints.get(best));
                unvisited.remove((Integer) best);
            }

            route.add(0); // back to depot
            twoOpt(route, dist);
            routes.add(route);
            vehicleCount++;
        }

        // If still unvisited jobs exist (no available vehicle/insufficient capacity), create extra routes (each job alone)
        while (!unvisited.isEmpty()) {
            int idx = unvisited.remove(0);
            List<Integer> route = new ArrayList<>();
            route.add(0);
            route.add(idx);
            route.add(0);
            routes.add(route);
        }

        // Build route plan object
        RoutePlan plan = new RoutePlan();
        plan.setNumberOfVehicles(routes.size());

        double totalKm = 0.0;
        List<DeliveryJob> resultJobs = new ArrayList<>();

        for (int v = 0; v < routes.size(); v++) {
            List<Integer> route = routes.get(v);
            totalKm += calculateRouteDistance(route, dist);

            Vehicle assignedVehicle = availableVehicles != null && availableVehicles.size() > v ? availableVehicles.get(v) : null;
            Long vehicleId = assignedVehicle != null ? assignedVehicle.getId() : null;
            String regNo = null;
            if (assignedVehicle != null) {
                regNo = assignedVehicle.getRegistrationNumber() != null ? assignedVehicle.getRegistrationNumber() : assignedVehicle.getLicensePlate();
            }

            // sequenceInRoute uses index within the route (1..len-2)
            for (int seq = 1; seq < route.size() - 1; seq++) {
                DeliveryJob job = allPoints.get(route.get(seq));
                // Set assignment fields
                job.setAssignedVehicleId(vehicleId);
                job.setAssignedVehicleRegNo(regNo);
                job.setAssignedDriverId(null); // driver assignment happens later
                job.setSequenceInRoute(seq);
                resultJobs.add(job);
            }
        }

        plan.setTotalDistanceKm(totalKm);
        // estimated time in minutes, round up
        int estimatedMinutes = (int) Math.ceil((totalKm / Math.max(1.0, AVERAGE_SPEED_KMH)) * 60.0);
        plan.setEstimatedTimeMinutes(estimatedMinutes);

        // attach jobs to plan (controller will set routePlan before saving)
        plan.setJobs(resultJobs);

        return plan;
    }

    private double getSafeWeight(DeliveryJob job) {
        return job.getWeightKg() == null ? 0.0 : job.getWeightKg();
    }

    private double OptionalVehicleCapacity(Vehicle v) {
        // If you later extend Vehicle with capacity field, use it. For now return default.
        // Example: return v.getCapacityKg() != null ? v.getCapacityKg() : DEFAULT_VEHICLE_CAPACITY_KG;
        return DEFAULT_VEHICLE_CAPACITY_KG;
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private double calculateRouteDistance(List<Integer> route, double[][] dist) {
        double total = 0;
        for (int i = 0; i < route.size() - 1; i++) {
            total += dist[route.get(i)][route.get(i + 1)];
        }
        return total;
    }

    private void twoOpt(List<Integer> route, double[][] dist) {
        boolean improved = true;
        while (improved) {
            improved = false;
            for (int i = 1; i < route.size() - 2; i++) {
                for (int k = i + 1; k < route.size() - 1; k++) {
                    if (cross(route, i, k, dist) < 0) {
                        reverse(route, i, k);
                        improved = true;
                    }
                }
            }
        }
    }

    private double cross(List<Integer> route, int i, int k, double[][] dist) {
        int a = route.get(i - 1);
        int b = route.get(i);
        int c = route.get(k);
        int d = route.get(k + 1);
        return dist[a][b] + dist[c][d] - dist[a][c] - dist[b][d];
    }

    private void reverse(List<Integer> route, int i, int k) {
        while (i < k) {
            int tmp = route.get(i);
            route.set(i, route.get(k));
            route.set(k, tmp);
            i++;
            k--;
        }
    }
}
