package com.example.eventmanagerbackend.controller;

import com.example.eventmanagerbackend.dto.PaymentDto;
import com.example.eventmanagerbackend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;


    @PreAuthorize("hasAuthority('MEMBER')")
    @PostMapping("/verify")
    public ResponseEntity<Void> verifyPayment(
            @RequestBody PaymentDto paymentInfo
    ) throws InterruptedException {
        Thread.sleep(2 * 1000);
        boolean isPaymentValid = paymentService.verifyPayment(paymentInfo);
        if (isPaymentValid) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

}
