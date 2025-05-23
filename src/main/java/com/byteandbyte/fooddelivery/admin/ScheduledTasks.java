package com.byteandbyte.fooddelivery.tasks;

import com.byteandbyte.fooddelivery.admin.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);
    private final AdminService adminService;

    @Autowired
    public ScheduledTasks(AdminService adminService) {
        this.adminService = adminService;
    }

    // Örnek: Her dakika çalışır (test için)
    // Gerçek uygulamada: "0 0 * * * *" (her saat başı) veya "0 0 0 * * *" (her gün gece yarısı)
    @Scheduled(cron = "0 * * * * *") // Her dakikanın 0. saniyesinde (yani her dakika başı)
    public void reactivateDeactivatedUsers() {
        logger.info("SCHEDULER: Running scheduled task to reactivate users with expired deactivation periods.");
        try {
            adminService.reactivateUsersWithExpiredDeactivation();
            logger.info("SCHEDULER: Scheduled user reactivation task completed.");
        } catch (Exception e) {
            logger.error("SCHEDULER: Error during scheduled user reactivation task: ", e);
        }
    }
}