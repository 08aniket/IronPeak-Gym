package com.furkankaya.security;

import com.furkankaya.config.ApplicationConfig;
import com.furkankaya.model.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final ApplicationConfig applicationConfig;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(x -> x
                // ── Public endpoints ──────────────────────────────────
                .requestMatchers(
                    "/api/v1/generateToken",
                    "/api/v1/refreshToken",
                    "/api/v1/changePassword",
                    "/api/v1/isAllowedToPass",
                    "/api/v1/prices",
                    "/api/v1/sendEmail",
                    "/api/v1/interest"
                ).permitAll()

                // ── Swagger / OpenAPI ─────────────────────────────────
                .requestMatchers(
                    "/api/v1/auth/**",
                    "/v2/api-docs", "/v3/api-docs", "/v3/api-docs/**",
                    "/swagger-resources", "/swagger-resources/**",
                    "/configuration/ui", "/configuration/security",
                    "/swagger-ui/**", "/webjars/**", "/swagger-ui.html"
                ).permitAll()

                // ── User-accessible endpoints ─────────────────────────
                .requestMatchers("/api/v1/days")
                    .hasAnyRole(Role.ROLE_USER.getValue(), Role.ROLE_ADMIN.getValue())
                .requestMatchers("/api/v1/measurements")
                    .hasAnyRole(Role.ROLE_USER.getValue(), Role.ROLE_ADMIN.getValue())

                // ── Admin-only endpoints ──────────────────────────────
                .requestMatchers(
                    "/api/v1/updateDate",
                    "/api/v1/insides",
                    "/api/v1/priceUpdate",
                    "/api/v1/measurementCreate",
                    "/api/v1/saveUser",
                    "/api/v1/members",
                    "/api/v1/members/**",
                    "/api/v1/dashboard/**",
                    "/api/v1/payments",
                    "/api/v1/payments/**",
                    "/api/v1/activity",
                    "/api/v1/renewals",
                    "/api/v1/renewals/**"
                ).hasRole(Role.ROLE_ADMIN.getValue())

                .requestMatchers(
                    "/api/v1/requestPasswordChangeCode",
                    "/api/v1/verifyPasswordChangeCode"
                ).hasAuthority(Role.ROLE_ADMIN.getAuthority())

                // ── Catch-all: any other /api/v1/ needs auth ──────────
                .requestMatchers("/api/v1/**")
                    .hasRole(Role.ROLE_ADMIN.getValue())

                // ── Everything else ───────────────────────────────────
                .anyRequest().authenticated()
            )
            .sessionManagement(x -> x.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(applicationConfig.authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Configuration(proxyBeanMethods = false)
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
        }
    }
}
