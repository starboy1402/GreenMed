package com.plantmanagement.repository;

import com.plantmanagement.entity.Review;
import com.plantmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findBySeller(User seller);

    List<Review> findByReviewer(User reviewer);

    boolean existsBySellerAndReviewer(User seller, User reviewer);
}