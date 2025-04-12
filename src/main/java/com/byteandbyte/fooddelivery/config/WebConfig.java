package com.byteandbyte.fooddelivery.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Allow requests from the React frontend
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")  // React dev server URL
                        .allowedMethods("*")
                        .allowCredentials(true);  // Allow all methods (GET, POST, PUT, DELETE, etc.)

            }
        };
    }
}
