package com.furkankaya.controller;

import com.furkankaya.dto.*;
import com.furkankaya.service.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserDetailsServiceImpl userDetailsService;

    // ── Prices ────────────────────────────────────────────────────

    @GetMapping("/prices")
    public ResponseEntity<PriceRequestResponse> getPrices() {
        return ResponseEntity.ok(userDetailsService.getPrices());
    }

    @PostMapping("/priceUpdate")
    public ResponseEntity<Void> updatePrice(@Valid @RequestBody PriceRequestResponse price) {
        userDetailsService.priceUpdate(price);
        return ResponseEntity.ok().build();
    }

    // ── Measurements ──────────────────────────────────────────────

    @PostMapping("/measurementCreate")
    public ResponseEntity<Void> measurementCreate(@Valid @RequestBody MeasurementRequestResponse measurement) {
        userDetailsService.measurementCreate(measurement);
        return ResponseEntity.ok().build();
    }

    // ── Occupancy ─────────────────────────────────────────────────

    @GetMapping("/insides")
    public ResponseEntity<Long> getInside() {
        return ResponseEntity.ok(userDetailsService.getInside());
    }

    // ── Days remaining (user + admin) ─────────────────────────────

    @GetMapping("/days")
    public ResponseEntity<Long> getUserDays(HttpServletRequest httpServletRequest) {
        return ResponseEntity.ok(userDetailsService.getUserDays(httpServletRequest));
    }

    // ── Update membership date ────────────────────────────────────

    @PostMapping("/updateDate")
    public ResponseEntity<Void> updateDate(@Valid @RequestBody UpdateDateRequest updateDateRequest) {
        userDetailsService.updateDate(updateDateRequest.email(), updateDateRequest.month());
        return ResponseEntity.ok().build();
    }

    // ── Member List ───────────────────────────────────────────────

    @GetMapping("/members")
    public ResponseEntity<List<MemberListResponse>> getAllMembers() {
        return ResponseEntity.ok(userDetailsService.getAllMembers());
    }

    @GetMapping("/members/export")
    public ResponseEntity<byte[]> exportMembersCsv() {
        String csv = userDetailsService.exportMembersCsv();
        byte[] bytes = csv.getBytes();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "ironpeak-members.csv");
        headers.setContentLength(bytes.length);
        return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
    }

    // ── Dashboard Stats ───────────────────────────────────────────

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(userDetailsService.getDashboardStats());
    }

    @GetMapping("/dashboard/occupancy")
    public ResponseEntity<List<OccupancyPointResponse>> getOccupancyHistory(
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(userDetailsService.getOccupancyHistory(days));
    }

    // ── Recent Activity ───────────────────────────────────────────

    @GetMapping("/activity")
    public ResponseEntity<List<ActivityLogResponse>> getRecentActivity(
            @RequestParam(defaultValue = "15") int limit) {
        return ResponseEntity.ok(userDetailsService.getRecentActivity(limit));
    }

    // ── Renewal Center ────────────────────────────────────────────

    @GetMapping("/renewals")
    public ResponseEntity<List<MemberListResponse>> getMembersExpiringSoon() {
        return ResponseEntity.ok(userDetailsService.getMembersExpiringSoon());
    }

    @PostMapping("/renewals/remind")
    public ResponseEntity<Void> sendRenewalReminder(@Valid @RequestBody RenewalReminderRequest request) {
        userDetailsService.sendRenewalReminder(request.email());
        return ResponseEntity.ok().build();
    }

    // ── Payments ─────────────────────────────────────────────────

    @PostMapping("/payments")
    public ResponseEntity<PaymentResponse> recordPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(userDetailsService.recordPayment(request));
    }

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(userDetailsService.getAllPayments());
    }

    @GetMapping("/payments/member/{email}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByMember(@PathVariable String email) {
        return ResponseEntity.ok(userDetailsService.getPaymentsByMember(email));
    }
}
