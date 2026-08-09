package com.crowdfunding.repositories;

import com.crowdfunding.models.Company;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
  Optional<Company> findByUserId(Long userId);
}
