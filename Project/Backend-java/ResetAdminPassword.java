import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class ResetAdminPassword {
    public static void main(String[] args) throws Exception {
        try (Connection connection = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/crowdfunding?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",
                "root", "Pushpesh@1407");
             PreparedStatement statement = connection.prepareStatement(
                "UPDATE users SET password = ? WHERE email = ?")) {
            statement.setString(1, new BCryptPasswordEncoder().encode("Admin123!"));
            statement.setString(2, "admin@crowdfunding.com");
            System.out.println("Updated admin accounts: " + statement.executeUpdate());
        }
    }
}
