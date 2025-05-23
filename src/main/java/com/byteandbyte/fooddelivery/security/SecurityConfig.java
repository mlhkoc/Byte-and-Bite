package com.byteandbyte.fooddelivery.security;

// ... (diğer importlarınız aynı kalacak) ...
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import com.byteandbyte.fooddelivery.auth.JwtRequestFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler; // Bu import önemli
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// import jakarta.servlet.ServletException; // Kullanılmıyorsa kaldırılabilir
// import jakarta.servlet.http.HttpServletRequest; // Kullanılmıyorsa kaldırılabilir
// import jakarta.servlet.http.HttpServletResponse; // Kullanılmıyorsa kaldırılabilir
// import org.springframework.security.core.Authentication; // Kullanılmıyorsa kaldırılabilir
// import org.springframework.security.core.AuthenticationException; // Kullanılmıyorsa kaldırılabilir
// import org.springframework.security.core.userdetails.UserDetailsService; // CustomUserDetailsService üzerinden kullanılıyor
// import org.springframework.security.web.authentication.AuthenticationFailureHandler; // Kullanılmıyorsa kaldırılabilir
// import org.springframework.security.web.authentication.AuthenticationSuccessHandler; // Kullanılmıyorsa kaldırılabilir
// import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler; // Kullanılmıyorsa kaldırılabilir
// import java.io.IOException; // Kullanılmıyorsa kaldırılabilir

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired // <<< BU SATIRI EKLEYİN
    private AccessDeniedHandler customAccessDeniedHandler; // <<< BU ALANI EKLEYİN (Tip: AccessDeniedHandler)

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configure(http)) // Spring Boot 3.1+ için
                // Eğer eski versiyon ise: .cors().and()
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/restaurant", "/api/orders/restaurant", "/api/menuManagement").hasRole("RESTAURANT")
                        .requestMatchers("/api/login", "/api/signup", "/api/restaurants", "/api/menu/*", "/api/restaurants/id/*").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exceptions -> exceptions
                        .accessDeniedHandler(customAccessDeniedHandler) // Artık tanımlı olacak
                        // .authenticationEntryPoint(...) // Opsiyonel: 401 için
                )
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .permitAll()
                );
        return http.build();
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
        // .and() Spring Security 6'da kaldırıldı, AuthenticationManagerBuilder üzerinden build() yapılır.
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}