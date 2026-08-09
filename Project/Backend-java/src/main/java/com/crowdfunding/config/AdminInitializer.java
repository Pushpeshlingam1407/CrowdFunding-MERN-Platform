package com.crowdfunding.config;

import com.crowdfunding.models.User;
import com.crowdfunding.repositories.UserRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Value("${ADMIN_EMAIL:admin@crowdfunding.com}")
  private String adminEmail;

  @Value("${ADMIN_PASSWORD:Admin123!}")
  private String adminPassword;

  @Value("${ADMIN_NAME:Administrator}")
  private String adminName;

  @Override
  public void run(String... args) throws Exception {
    try {
      Optional<User> existingUserOpt = userRepository.findByEmail(adminEmail);

      if (existingUserOpt.isPresent()) {
        User existingUser = existingUserOpt.get();
        if (!"admin".equalsIgnoreCase(existingUser.getRole())) {
          existingUser.setRole("admin");
          existingUser.setVerified(true);
          userRepository.save(existingUser);
          System.out.println("✅ Admin role corrected for: " + adminEmail);
        } else {
          System.out.println("✅ Admin user exists: " + adminEmail);
        }
      } else {
        User admin = User.builder()
          .name(adminName)
          .email(adminEmail)
          .password(passwordEncoder.encode(adminPassword))
          .role("admin")
          .isVerified(true)
          .build();
        userRepository.save(admin);
        System.out.println("✅ Admin user created: " + adminEmail);
      }
    } catch (Exception e) {
      System.err.println("❌ Failed to ensure admin user: " + e.getMessage());
    }
  }
}
