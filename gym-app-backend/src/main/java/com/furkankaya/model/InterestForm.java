package com.furkankaya.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interest_forms")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class InterestForm {

    public enum Status {
        PENDING,
        APPROVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String phone;
    private String age;
    private String gender;
    private String fitnessGoal;

    @Column(length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    private LocalDateTime submittedAt;
    private LocalDateTime approvedAt;

    @PrePersist
    protected void onCreate() {
        if (this.submittedAt == null) this.submittedAt = LocalDateTime.now();
        if (this.status == null) this.status = Status.PENDING;
    }
}
