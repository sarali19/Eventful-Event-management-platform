package com.example.eventmanagerbackend.service;

import com.example.eventmanagerbackend.dto.EventCreateDto;
import com.example.eventmanagerbackend.dto.EventResponseDto;
import com.example.eventmanagerbackend.dto.EventUpdateDto;
import com.example.eventmanagerbackend.dto.PaymentDto;
import com.example.eventmanagerbackend.entity.Event;
import com.example.eventmanagerbackend.entity.EventRating;
import com.example.eventmanagerbackend.entity.User;
import com.example.eventmanagerbackend.enums.EventCategory;
import com.example.eventmanagerbackend.repository.EventRatingRepository;
import com.example.eventmanagerbackend.repository.EventRepository;
import com.example.eventmanagerbackend.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private String validCardNumber = "1234567812345678";
    private String validExpirationDate = "24/12";
    private String validCvv = "999";

    public boolean verifyPayment(PaymentDto paymentInfo) {
        return paymentInfo.getCardNumber().equals(validCardNumber) && paymentInfo.getExpirationDate().equals(validExpirationDate) && paymentInfo.getCvv().equals(validCvv);
    }
}
