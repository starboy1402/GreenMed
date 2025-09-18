package com.plantmanagement.service;

import com.plantmanagement.dto.PaymentRequest;
import com.plantmanagement.entity.Order;
import com.plantmanagement.entity.Payment;
import com.plantmanagement.entity.User;
import com.plantmanagement.repository.OrderRepository;
import com.plantmanagement.repository.PaymentRepository;
import com.plantmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    

     public Payment processPayment(Long orderId, PaymentRequest paymentRequest, String customerEmail) throws AccessDeniedException {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Security check: ensure the user paying is the one who created the order
        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new AccessDeniedException("You are not authorized to pay for this order.");
        }

        if (order.getStatus() != Order.OrderStatus.PENDING_PAYMENT) {
            throw new RuntimeException("This order is not pending payment.");
        }

        // --- Payment Simulation ---
          Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        payment.setTransactionId(paymentRequest.getTransactionId()); // Use the ID from the request
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        
        paymentRepository.save(payment);

        // --- Update Order Status ---
        order.setStatus(Order.OrderStatus.PROCESSING);
        orderRepository.save(order);

        return payment;
    }
}
