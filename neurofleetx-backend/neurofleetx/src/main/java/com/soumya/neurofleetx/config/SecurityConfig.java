// src/main/java/com/soumya/neurofleetx/config/SecurityConfig.java
package com.soumya.neurofleetx.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // THIS IS THE FINAL FIX — PERMIT ALL API ENDPOINTS FIRST
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/optimize/**").permitAll()     // ← THIS LINE FIRST
                        .requestMatchers("/api/**").permitAll()              // ← THIS SECOND
                        .requestMatchers("/login", "/register").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .anyRequest().permitAll()                            // ← Keep this last
                );

        return http.build();
    }
}