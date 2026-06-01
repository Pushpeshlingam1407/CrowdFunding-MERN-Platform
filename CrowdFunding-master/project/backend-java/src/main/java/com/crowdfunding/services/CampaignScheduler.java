package com.crowdfunding.services;

import com.crowdfunding.models.Project;
import com.crowdfunding.repositories.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class CampaignScheduler {

    @Autowired
    private ProjectRepository projectRepository;

    // Run every hour at the top of the hour: 0 0 * * * *
    @Scheduled(cron = "0 0 * * * *")
    public void lockExpiredProjects() {
        try {
            LocalDateTime now = LocalDateTime.now();
            List<Project> expiredProjects = projectRepository.findByEndDateBeforeAndIsLocked(now, false);

            if (!expiredProjects.isEmpty()) {
                for (Project project : expiredProjects) {
                    project.setLocked(true);
                }
                projectRepository.saveAll(expiredProjects);
                System.out.println("✅ Locked " + expiredProjects.size() + " expired projects.");
            }
        } catch (Exception e) {
            System.err.println("❌ Error locking expired projects: " + e.getMessage());
        }
    }
}
