package com.plantmanagement.repository;

import com.plantmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.applicationStatus = :status")
    List<User> findByRoleAndApplicationStatus(
        @Param("role") User.UserRole role, 
        @Param("status") User.ApplicationStatus status
    );
    
    @Query("SELECT u FROM User u WHERE u.role = 'SELLER' AND u.applicationStatus = 'PENDING'")
    List<User> findPendingSellers();
    
    @Query("SELECT u FROM User u WHERE u.role = 'SELLER' AND u.applicationStatus = 'APPROVED' AND u.isActive = true")
    List<User> findActiveSellers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") User.UserRole role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'SELLER' AND u.applicationStatus = :status")
    long countSellersByApplicationStatus(@Param("status") User.ApplicationStatus status);
}