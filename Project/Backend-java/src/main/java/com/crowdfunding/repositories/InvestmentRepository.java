package com.crowdfunding.repositories;

import com.crowdfunding.models.Investment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
  List<Investment> findByInvestorIdOrderByCreatedAtDesc(Long investorId);
  List<Investment> findByProjectIdOrderByCreatedAtDesc(Long projectId);
  List<Investment> findByProjectCreatorIdOrderByCreatedAtDesc(Long creatorId);
}
