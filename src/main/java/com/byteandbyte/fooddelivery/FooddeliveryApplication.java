package com.byteandbyte.fooddelivery; // Ana uygulama paketiniz

import com.byteandbyte.fooddelivery.admin.Admin;
import com.byteandbyte.fooddelivery.admin.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class FooddeliveryApplication {

    public static void main(String[] args) {
        SpringApplication.run(FooddeliveryApplication.class, args);
    }

    // Admin kullanıcısını başlangıçta oluşturmak için (eğer yoksa)
    @Bean
    CommandLineRunner initAdmin(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@gmail.com"; // Admin e-postanız
            String adminPassword = "Admin1234."; // Admin şifreniz (güçlü bir şifre seçin)

            if (adminRepository.findByEmail(adminEmail).isEmpty()) {
                Admin admin = new Admin();
                admin.setEmail(adminEmail);
                admin.setPasswordHash(passwordEncoder.encode(adminPassword));
                adminRepository.save(admin);
                System.out.println("Admin user created: " + adminEmail);
            }
        };
    }
}