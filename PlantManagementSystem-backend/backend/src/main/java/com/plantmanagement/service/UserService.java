package com.plantmanagement.service;

import com.plantmanagement.dto.UserUpdateRequest;
import com.plantmanagement.entity.User;
import com.plantmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getActiveSellers() {
        return userRepository.findActiveSellers();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserProfile(String email, UserUpdateRequest request) {
        User user = getUserByEmail(email);
        if (request.getName() != null)
            user.setName(request.getName());
        if (request.getPhoneNumber() != null)
            user.setPhoneNumber(request.getPhoneNumber());
        if (request.getAddress() != null)
            user.setAddress(request.getAddress());
        if (request.getShopName() != null)
            user.setShopName(request.getShopName());
        return userRepository.save(user);
    }
}