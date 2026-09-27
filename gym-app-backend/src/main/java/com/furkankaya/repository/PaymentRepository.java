package com.furkankaya.repository;

import com.furkankaya.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByMemberEmailOrderByPaymentDateDesc(String memberEmail);
    List<Payment> findAllByOrderByPaymentDateDesc();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentDate >= :startDate AND p.paymentDate < :endDate")
    Long sumAmountBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
