package com.managementsystem.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/users/**").permitAll()
                    .requestMatchers("/api/roles/**").permitAll()
                    .requestMatchers("/api/customers/**").permitAll()
                    .requestMatchers("/api/customer/contact-persons/**").permitAll()
                    .requestMatchers("/api/projects/**").permitAll()
                    .requestMatchers("/api/tasks/**").permitAll()
                    .requestMatchers("/api/task-states/**").permitAll()
                    .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}