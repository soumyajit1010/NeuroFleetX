package com.soumya.neurofleetx.service;

import com.soumya.neurofleetx.entity.MaintenanceLog;
import com.soumya.neurofleetx.entity.Vehicle;
import com.soumya.neurofleetx.entity.VehicleHealth;
import com.soumya.neurofleetx.repository.MaintenanceLogRepository;
import com.soumya.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class MaintenanceLogService {

    @Autowired
    private MaintenanceLogRepository logRepo;

    @Autowired
    private VehicleRepository vehicleRepo;

    @Autowired
    private VehicleHealthService healthService;

    public List<MaintenanceLog> getLogsForVehicle(Long vehicleId) {
        return logRepo.findByVehicleId(vehicleId);
    }

    @Transactional
    public MaintenanceLog addMaintenanceLog(Long vehicleId, MaintenanceLog payload) {

        // load vehicle
        Vehicle vehicle = vehicleRepo.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found: " + vehicleId));

        // create log entry
        MaintenanceLog log = new MaintenanceLog();
        log.setVehicle(vehicle);
        log.setServiceType(payload.getServiceType());
        log.setServiceDate(payload.getServiceDate() == null ? LocalDate.now() : payload.getServiceDate());
        log.setMechanicName(payload.getMechanicName());
        log.setCost(payload.getCost());
        log.setNotes(payload.getNotes());
        log.setNextDueDate(payload.getNextDueDate());

        MaintenanceLog savedLog = logRepo.save(log);

        // update health record
        VehicleHealth vh = healthService.getOrCreateHealthRecord(vehicleId);

        // small improvement after servicing
        vh.setEngineHealth(Math.min(100, (vh.getEngineHealth() == null ? 100 : vh.getEngineHealth()) + 5));
        vh.setTyreHealth(Math.min(100, (vh.getTyreHealth() == null ? 100 : vh.getTyreHealth()) + 5));
        vh.setBrakeHealth(Math.min(100, (vh.getBrakeHealth() == null ? 100 : vh.getBrakeHealth()) + 5));

        vh.setLastServiceDate(savedLog.getServiceDate());
        if (savedLog.getNextDueDate() != null) {
            vh.setNextServiceDate(savedLog.getNextDueDate());
        }

        vh.setOverallHealth(healthService.calculateOverallHealth(vh));

        return savedLog;
    }

    @Transactional
    public void deleteLog(Long id) {
        logRepo.deleteById(id);
    }
}
