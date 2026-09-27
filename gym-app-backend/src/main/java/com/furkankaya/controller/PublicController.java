package com.furkankaya.controller;

import com.furkankaya.dto.InterestFormRequest;
import com.furkankaya.dto.InterestFormResponse;
import com.furkankaya.model.InterestForm;
import com.furkankaya.repository.InterestFormRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PublicController {

    private final InterestFormRepository interestFormRepository;

    // Public — anyone can submit
    @PostMapping("/interest")
    public ResponseEntity<Void> submitInterest(@Valid @RequestBody InterestFormRequest request) {
        interestFormRepository.save(InterestForm.builder()
            .fullName(request.fullName())
            .email(request.email())
            .phone(request.phone())
            .age(request.age())
            .gender(request.gender())
            .fitnessGoal(request.fitnessGoal())
            .message(request.message())
            .build());
        return ResponseEntity.ok().build();
    }

    // Admin-only — view all submissions
    @GetMapping("/interest")
    public ResponseEntity<List<InterestFormResponse>> getAllInterest() {
        List<InterestFormResponse> list = interestFormRepository
            .findAllByOrderBySubmittedAtDesc()
            .stream()
            .map(f -> InterestFormResponse.builder()
                .id(f.getId())
                .fullName(f.getFullName())
                .email(f.getEmail())
                .phone(f.getPhone())
                .age(f.getAge())
                .gender(f.getGender())
                .fitnessGoal(f.getFitnessGoal())
                .message(f.getMessage())
                .status(f.getStatus() != null ? f.getStatus().name() : "PENDING")
                .submittedAt(f.getSubmittedAt())
                .approvedAt(f.getApprovedAt())
                .build())
            .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PatchMapping("/interest/{id}/approve")
    public ResponseEntity<InterestFormResponse> approveInterest(@PathVariable Long id) {
        InterestForm form = interestFormRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Interest submission not found: " + id));

        form.setStatus(InterestForm.Status.APPROVED);
        form.setApprovedAt(java.time.LocalDateTime.now());
        InterestForm saved = interestFormRepository.save(form);

        return ResponseEntity.ok(InterestFormResponse.builder()
            .id(saved.getId())
            .fullName(saved.getFullName())
            .email(saved.getEmail())
            .phone(saved.getPhone())
            .age(saved.getAge())
            .gender(saved.getGender())
            .fitnessGoal(saved.getFitnessGoal())
            .message(saved.getMessage())
            .status(saved.getStatus().name())
            .submittedAt(saved.getSubmittedAt())
            .approvedAt(saved.getApprovedAt())
            .build());
    }
}
