package com.plantmanagement.service;

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
}