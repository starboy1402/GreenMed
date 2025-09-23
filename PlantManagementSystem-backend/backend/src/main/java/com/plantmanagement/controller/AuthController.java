package com.plantmanagement.controller;

import com.plantmanagement.dto.LoginRequest;
import com.plantmanagement.dto.LoginResponse;
import com.plantmanagement.dto.SignupRequest;
import com.plantmanagement.dto.UserResponse;
import com.plantmanagement.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:8081", "http://localhost:8082" })
public class AuthController {

    private final AuthService authService;

    // Add a test endpoint to check if the controller is working
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(new SuccessResponse("success", "Auth controller is working"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            UserResponse userResponse = authService.signup(request);
            return ResponseEntity.ok(userResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            System.out.println("Login attempt for email: " + request.getEmail()); // Debug log
            LoginResponse loginResponse = authService.login(request);
            System.out.println("Login successful for email: " + request.getEmail()); // Debug log
            return ResponseEntity.ok(loginResponse);
        } catch (RuntimeException e) {
            System.err.println("Login failed for email: " + request.getEmail() + ", Error: " + e.getMessage()); // Debug
                                                                                                                // log
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                authService.logout(authHeader);
                return ResponseEntity.ok(new SuccessResponse("success", "Logged out successfully"));
            }
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("error", "No valid token provided"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                UserResponse userResponse = authService.getCurrentUser(authHeader);
                return ResponseEntity.ok(userResponse);
            }
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("error", "No valid token provided"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("error", e.getMessage()));
        }
    }

    // Response DTOs
    public static class ErrorResponse {
        private String status;
        private String message;

        public ErrorResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }

        public String getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }
    }

    public static class SuccessResponse {
        private String status;
        private String message;

        public SuccessResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }

        public String getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }
    }
}