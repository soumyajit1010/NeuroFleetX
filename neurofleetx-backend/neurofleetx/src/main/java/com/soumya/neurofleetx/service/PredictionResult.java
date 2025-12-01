package com.soumya.neurofleetx.service;

public class PredictionResult {
    private String risk; // LOW / MEDIUM / HIGH
    private int daysRemaining;
    private int overallHealth;

    public PredictionResult() {}

    public PredictionResult(String risk, int daysRemaining, int overallHealth) {
        this.risk = risk;
        this.daysRemaining = daysRemaining;
        this.overallHealth = overallHealth;
    }

    public String getRisk() {
        return risk;
    }
    public void setRisk(String risk) {
        this.risk = risk;
    }
    public int getDaysRemaining() {
        return daysRemaining;
    }
    public void setDaysRemaining(int daysRemaining) {
        this.daysRemaining = daysRemaining;
    }
    public int getOverallHealth() {
        return overallHealth;
    }
    public void setOverallHealth(int overallHealth) {
        this.overallHealth = overallHealth;
    }
}
