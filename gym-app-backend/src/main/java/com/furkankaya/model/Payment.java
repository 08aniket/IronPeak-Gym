package com.furkankaya.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "receipt_number", unique = true)
    private String receiptNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "member_email")
    private String memberEmail;

    @Column(name = "member_name")
    private String memberName;

    @Column(name = "plan")
    private String plan;           // "1 Month", "3 Months", etc.

    @Column(name = "amount")
    private Long amount;

    @Column(name = "payment_mode")
    private String paymentMode;    // Cash, UPI, Card

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "remarks")
    private String remarks;

    @PrePersist
    protected void onCreate() {
        if (this.paymentDate == null) {
            this.paymentDate = LocalDate.now();
        }
        if (this.receiptNumber == null) {
            this.receiptNumber = "IP-" + System.currentTimeMillis();
        }
    }
}
