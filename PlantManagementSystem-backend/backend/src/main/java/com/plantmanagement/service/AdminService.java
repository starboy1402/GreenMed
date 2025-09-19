package com.plantmanagement.service;

import com.plantmanagement.entity.Order;
import com.plantmanagement.entity.User;
import com.plantmanagement.repository.OrderRepository;
import com.plantmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public List<User> getPendingSellers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getUserType() == User.UserRole.SELLER
                        && user.getApplicationStatus() == User.ApplicationStatus.PENDING)
                .collect(Collectors.toList());
    }

    public void approveSeller(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        if (seller.getUserType() == User.UserRole.SELLER) {
            seller.setApplicationStatus(User.ApplicationStatus.APPROVED);
            userRepository.save(seller);
        } else {
            throw new RuntimeException("User is not a seller");
        }
    }

    public void rejectSeller(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        if (seller.getUserType() == User.UserRole.SELLER) {
            seller.setApplicationStatus(User.ApplicationStatus.REJECTED);
            userRepository.save(seller);
        } else {
            throw new RuntimeException("User is not a seller");
        }
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}