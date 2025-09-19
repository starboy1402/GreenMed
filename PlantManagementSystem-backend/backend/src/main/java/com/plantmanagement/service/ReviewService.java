package com.plantmanagement.service;

import com.plantmanagement.entity.Review;
import com.plantmanagement.entity.User;
import com.plantmanagement.repository.ReviewRepository;
import com.plantmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public List<Review> getReviewsBySeller(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        return reviewRepository.findBySeller(seller);
    }

    public Review createReview(Long sellerId, String reviewerEmail, int rating, String comment) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        User reviewer = userRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        if (seller.getId().equals(reviewer.getId())) {
            throw new RuntimeException("Cannot review yourself");
        }

        if (reviewRepository.existsBySellerAndReviewer(seller, reviewer)) {
            throw new RuntimeException("You have already reviewed this seller");
        }

        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Review review = new Review();
        review.setSeller(seller);
        review.setReviewer(reviewer);
        review.setRating(rating);
        review.setComment(comment);

        return reviewRepository.save(review);
    }

    public double getAverageRatingForSeller(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        
        List<Review> reviews = reviewRepository.findBySeller(seller);
        
        if (reviews.isEmpty()) {
            return 0.0;
        }
        
        double sum = reviews.stream()
                .mapToDouble(Review::getRating)
                .sum();
        
        return Math.round((sum / reviews.size()) * 10.0) / 10.0; // Round to 1 decimal place
    }

    public int getTotalReviewsForSeller(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        
        return reviewRepository.findBySeller(seller).size();
    }
}