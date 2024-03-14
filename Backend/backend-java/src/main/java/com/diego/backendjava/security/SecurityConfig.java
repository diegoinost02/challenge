package com.diego.backendjava.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.diego.backendjava.security.filter.JwtAuthenticationFilter;
import com.diego.backendjava.security.filter.JwtValidationFilter;


@Configuration
public class SecurityConfig {
    
    @Autowired
    private AuthenticationConfiguration authenticationConfiguration;

    @Bean
    AuthenticationManager authenticationManager() throws Exception {
        return this.authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests( (authz) -> authz
        .requestMatchers(HttpMethod.POST,"/api/users/register").permitAll()
        .requestMatchers(HttpMethod.GET,"/api/users/profile/{username}").hasRole("USER")
        //.requestMatchers(HttpMethod.POST,"/login").permitAll()

        .requestMatchers(HttpMethod.POST,"/api/notes/create").hasRole("USER")
        .requestMatchers(HttpMethod.PUT,"/api/notes/update/{id}").hasRole("USER")
        .requestMatchers(HttpMethod.GET,"/api/notes/user/{userId}").hasRole("USER")
        .requestMatchers(HttpMethod.GET,"/api/notes/user/{userId}/archive").hasRole("USER")
        .requestMatchers(HttpMethod.GET,"/api/notes/user/{userId}/category/{categoryId}").hasRole("USER")

        .requestMatchers(HttpMethod.GET,"/api/categories/user/{userId}").hasRole("USER")
        .requestMatchers(HttpMethod.POST,"/api/categories/create").hasRole("USER")
        .requestMatchers(HttpMethod.DELETE,"/api/categories/delete/{id}").hasRole("USER")

        .anyRequest().authenticated())
        .addFilter(new JwtAuthenticationFilter(this.authenticationManager()))
        .addFilter(new JwtValidationFilter(this.authenticationManager()))
        .csrf(config -> config.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("http://localhost:4200/"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    FilterRegistrationBean<CorsFilter> corsFilter() {
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(corsConfigurationSource()));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
