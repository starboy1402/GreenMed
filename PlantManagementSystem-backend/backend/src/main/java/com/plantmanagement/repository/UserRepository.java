package com.plantmanagement.repository;

import com.plantmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- Import this
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // --- Start of Fix ---

    // The original method name 'findActiveSellers' was ambiguous after our changes.
    // By adding the @Query annotation, we are explicitly telling Spring Data JPA
    // exactly what query to run, which resolves the startup error.
    @Query("SELECT u FROM User u WHERE u.userType = 'SELLER' AND u.isActive = true")
    List<User> findActiveSellers();

    // --- End of Fix ---
}