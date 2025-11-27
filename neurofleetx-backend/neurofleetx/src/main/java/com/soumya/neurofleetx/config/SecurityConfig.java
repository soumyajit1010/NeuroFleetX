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

    // This bean is needed by your UserService
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (we are stateless + API only)
                .csrf(csrf -> csrf.disable())

                // Allow all API endpoints + login/register + H2 console
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**", "/login", "/register", "/h2-console/**").permitAll()
                        .anyRequest().permitAll()
                )

                // Stateless = no sessions
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Only if you use H2 console in browser
                .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}