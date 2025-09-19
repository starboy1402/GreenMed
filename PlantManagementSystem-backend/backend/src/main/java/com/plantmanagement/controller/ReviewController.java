package com.plantmanagement.controller;

import com.plantmanagement.entity.Review;
import com.plantmanagement.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8081")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Review>> getReviewsBySeller(@PathVariable Long sellerId) {
        return ResponseEntity.ok(reviewService.getReviewsBySeller(sellerId));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Review> createReview(
            @RequestBody Map<String, Object> request,
            Principal principal) {
        try {
            Long sellerId = Long.valueOf(request.get("sellerId").toString());
            int rating = Integer.parseInt(request.get("rating").toString());
            String comment = (String) request.get("comment");

            Review review = reviewService.createReview(sellerId, principal.getName(), rating, comment);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/seller/{sellerId}/rating")
    public ResponseEntity<Map<String, Object>> getSellerRating(@PathVariable Long sellerId) {
        double averageRating = reviewService.getAverageRatingForSeller(sellerId);
        int totalReviews = reviewService.getTotalReviewsForSeller(sellerId);

        Map<String, Object> ratingData = new HashMap<>();
        ratingData.put("averageRating", averageRating);
        ratingData.put("totalReviews", totalReviews);

        return ResponseEntity.ok(ratingData);
    }
}