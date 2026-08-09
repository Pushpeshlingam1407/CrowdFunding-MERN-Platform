package com.crowdfunding.repositories;

import com.crowdfunding.models.Document;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
  List<Document> findByUserIdOrderByCreatedAtDesc(Long userId);
}
