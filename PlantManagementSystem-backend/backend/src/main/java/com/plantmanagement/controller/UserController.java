package com.plantmanagement.controller;

import com.plantmanagement.dto.UserResponse;
import com.plantmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8081")
public class UserController {

    private final UserService userService;

    @GetMapping("/sellers")
    public ResponseEntity<List<UserResponse>> getActiveSellers() {
        List<UserResponse> sellers = userService.getActiveSellers().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(sellers);
    }
}