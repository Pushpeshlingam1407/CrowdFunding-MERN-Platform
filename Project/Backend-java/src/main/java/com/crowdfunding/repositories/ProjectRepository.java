package com.crowdfunding.repositories;

import com.crowdfunding.models.Project;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
  List<Project> findByStatusOrderByCreatedAtDesc(String status);
  List<Project> findByCreatorIdOrderByCreatedAtDesc(Long creatorId);
  List<Project> findByEndDateBeforeAndIsLocked(
    LocalDateTime dateTime,
    boolean isLocked
  );
}
