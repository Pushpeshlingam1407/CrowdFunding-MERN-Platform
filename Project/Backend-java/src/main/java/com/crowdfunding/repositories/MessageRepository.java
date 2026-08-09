package com.crowdfunding.repositories;

import com.crowdfunding.models.Message;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
  List<Message> findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByCreatedAtAsc(
    Long senderId1,
    Long receiverId1,
    Long senderId2,
    Long receiverId2
  );
}
