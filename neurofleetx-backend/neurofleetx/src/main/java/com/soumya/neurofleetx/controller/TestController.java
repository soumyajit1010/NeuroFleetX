package com.soumya.neurofleetx.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/hello")
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Backend is alive!");
        response.put("time", new Date().toString());
        return response;
    }

    @GetMapping("/plans")
    public List<String> plans() {
        return Arrays.asList("Plan 1", "Plan 2", "Plan 3");
    }
}