package com.furkankaya.service;

import com.furkankaya.config.PasswordEncoderConfig;
import com.furkankaya.dto.*;
import com.furkankaya.dto.converter.*;
import com.furkankaya.model.*;
import com.furkankaya.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final MeasurementRepository measurementRepository;
    private final UserConverter userConverter;
    private final PriceConverter priceConverter;
    private final MeasurementConveter measurementConveter;
    private final PriceRepository priceRepository;
    private final PasswordEncoderConfig passwordEncoderConfig;
    private final MailService mailService;
    private final PaymentRepository paymentRepository;
    private final ActivityLogRepository activityLogRepository;
    private final OccupancyEventRepository occupancyEventRepository;

    @Lazy
    private final JwtService jwtService;

    public UserDetailsServiceImpl(UserRepository userRepository,
                                  MeasurementRepository measurementRepository,
                                  UserConverter userConverter,
                                  PriceConverter priceConverter,
                                  MeasurementConveter measurementConveter,
                                  PriceRepository priceRepository,
                                  PasswordEncoderConfig passwordEncoderConfig,
                                  MailService mailService,
                                  PaymentRepository paymentRepository,
                                  ActivityLogRepository activityLogRepository,
                                  OccupancyEventRepository occupancyEventRepository,
                                  @Lazy JwtService jwtService) {
        this.userRepository = userRepository;
        this.measurementRepository = measurementRepository;
        this.userConverter = userConverter;
        this.priceConverter = priceConverter;
        this.measurementConveter = measurementConveter;
        this.priceRepository = priceRepository;
        this.passwordEncoderConfig = passwordEncoderConfig;
        this.mailService = mailService;
        this.paymentRepository = paymentRepository;
        this.activityLogRepository = activityLogRepository;
        this.occupancyEventRepository = occupancyEventRepository;
        this.jwtService = jwtService;
    }

    // ── Core UserDetailsService ───────────────────────────────────

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email);
    }

    public UserResponse createUser(CreateUserRequest request) {
        User user = userConverter.toUser(request);
        userRepository.save(user);
        logActivity("MEMBER_CREATED",
                "New member registered: " + user.getFirstName() + " " + user.getLastName(),
                user.getFirstName() + " " + user.getLastName());
        return userConverter.toUserResponse(user);
    }

    @Transactional
    public UserResponse changePassword(HttpServletRequest httpServletRequest, ChangePasswordRequest request) {
        String email = jwtService.resolveRequest(httpServletRequest);
        User user = userRepository.findByEmail(email);
        if (user.getUsername().equals(email) &&
                passwordEncoderConfig.passwordEncoder().matches(request.oldPassword(), user.getPassword())) {
            user.setPassword(passwordEncoderConfig.passwordEncoder().encode(request.newPassword()));
            userRepository.save(user);
            mailService.sendMail(user.getEmail(), "Your IronPeak Gym password has been changed.");
            return userConverter.toUserResponse(user);
        }
        throw new RuntimeException("Old password is incorrect.");
    }

    @Transactional
    public Boolean isAllowedToPass(String uuid) {
        User user = getUserByUUID(uuid);
        LocalDate endDate = user.getEndDate();
        LocalDate now = LocalDate.now();
        if (endDate != null && endDate.isBefore(now)) {
            throw new RuntimeException("User's access has expired.");
        }
        boolean entering = !user.isInside();
        user.setInside(entering);
        userRepository.save(user);
        occupancyEventRepository.save(OccupancyEvent.builder()
                .user(user)
                .eventType(entering ? "CHECK_IN" : "CHECK_OUT")
                .occurredAt(LocalDateTime.now())
                .build());
        return true;
    }

    public User getUserByUUID(String uuid) {
        User user = userRepository.findByUuid(uuid);
        if (user == null) throw new UsernameNotFoundException(uuid);
        return user;
    }

    public void priceUpdate(PriceRequestResponse priceRequest) {
        Price price = priceRepository.findById(100L)
                .orElseThrow(() -> new RuntimeException("Price not found."));
        price.setOneMonths(priceRequest.oneMonths());
        price.setThreeMonths(priceRequest.threeMonths());
        price.setSixMonths(priceRequest.sixMonths());
        price.setTwelveMonths(priceRequest.twelveMonths());
        priceRepository.save(price);
    }

    public PriceRequestResponse getPrices() {
        Price price = priceRepository.findById(100L)
                .orElseThrow(() -> new RuntimeException("Price not found."));
        return priceConverter.toPriceRequestResponse(price);
    }

    public void measurementCreate(MeasurementRequestResponse req) {
        Measurement measurement = measurementConveter.toMeasurement(req);
        measurementRepository.save(measurement);
        logActivity("MEASUREMENT", "Body measurement logged for " + req.email(), req.email());
    }

    public List<MeasurementResponse> getMeasurements(HttpServletRequest httpServletRequest) {
        String email = jwtService.resolveRequest(httpServletRequest);
        return measurementConveter.toListMeasurementResponse(email);
    }

    public Long getInside() {
        return userRepository.countByInside(true);
    }

    public Long getUserDays(HttpServletRequest httpServletRequest) {
        String email = jwtService.resolveRequest(httpServletRequest);
        User user = userRepository.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found.");
        LocalDate endDate = user.getEndDate();
        LocalDate now = LocalDate.now();
        if (endDate == null || endDate.isBefore(now)) return 0L;
        return Math.max(ChronoUnit.DAYS.between(now, endDate), 0L);
    }

    public void updateDate(String email, int month) {
        User user = userRepository.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found.");
        LocalDate now = LocalDate.now();
        LocalDate end = user.getEndDate();
        LocalDate newEnd = (end == null || end.isBefore(now)) ? now.plusMonths(month) : end.plusMonths(month);
        user.setEndDate(newEnd);
        userRepository.save(user);
        logActivity("RENEWAL",
                "Membership extended by " + month + " month(s) for " + user.getFirstName() + " " + user.getLastName(),
                user.getFirstName() + " " + user.getLastName());
    }

    public void sendEmail(EmailRequest email) {
        mailService.sendMail("gym.app36@gmail.com",
                email.message() + "\n" + email.firstName() + " " + email.lastName() + "\n" + email.email());
    }

    // ── Member List ───────────────────────────────────────────────

    public List<MemberListResponse> getAllMembers() {
        return userRepository.findAllRegularUsers().stream()
                .map(this::toMemberListResponse)
                .collect(Collectors.toList());
    }

    public List<MemberListResponse> getMembersExpiringSoon() {
        LocalDate now = LocalDate.now();
        LocalDate soon = now.plusDays(7);
        return userRepository.findAllRegularUsers().stream()
                .filter(u -> u.getEndDate() != null
                        && !u.getEndDate().isBefore(now)
                        && !u.getEndDate().isAfter(soon))
                .map(this::toMemberListResponse)
                .collect(Collectors.toList());
    }

    private MemberListResponse toMemberListResponse(User user) {
        LocalDate now = LocalDate.now();
        LocalDate endDate = user.getEndDate();
        long daysLeft = 0;
        String status;
        if (endDate == null || endDate.isBefore(now)) {
            status = "EXPIRED";
        } else {
            daysLeft = ChronoUnit.DAYS.between(now, endDate);
            status = daysLeft <= 10 ? "EXPIRING_SOON" : "ACTIVE";
        }
        return MemberListResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .uuid(user.getUuid())
                .createdDate(user.getCreatedDate())
                .endDate(endDate)
                .inside(user.isInside())
                .status(status)
                .daysLeft(daysLeft)
                .build();
    }

    // ── Dashboard Stats ───────────────────────────────────────────

    public DashboardStatsResponse getDashboardStats() {
        LocalDate now = LocalDate.now();
        LocalDate soon = now.plusDays(10);
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate nextMonthStart = monthStart.plusMonths(1);
        LocalDate previousMonthStart = monthStart.minusMonths(1);
        long revenueThisMonth = paymentRepository.sumAmountBetween(monthStart, nextMonthStart);
        long revenuePreviousMonth = paymentRepository.sumAmountBetween(previousMonthStart, monthStart);
        String revenueTrend = revenuePreviousMonth == 0
            ? (revenueThisMonth > 0 ? "New this month" : "No change")
            : String.format("%+.0f%% vs last month", ((revenueThisMonth - revenuePreviousMonth) * 100.0) / revenuePreviousMonth);
        return DashboardStatsResponse.builder()
                .totalMembers(userRepository.countActiveMembers(now) + userRepository.countExpiredMembers(now))
                .activeMembers(userRepository.countActiveMembers(now))
                .expiredMembers(userRepository.countExpiredMembers(now))
                .expiringSoon(userRepository.countExpiringSoon(now, soon))
                .insideNow(userRepository.countByInside(true))
                .revenueThisMonth(revenueThisMonth)
                .revenueTrend(revenueTrend)
                .build();
    }

            public List<OccupancyPointResponse> getOccupancyHistory(int days) {
            int safeDays = Math.max(1, Math.min(days, 31));
            LocalDateTime since = LocalDateTime.now().minusDays(safeDays);
            List<OccupancyEvent> events = occupancyEventRepository.findByOccurredAtAfterOrderByOccurredAtAsc(since);
            return events.stream()
                .collect(Collectors.groupingBy(
                    event -> event.getOccurredAt().getDayOfWeek().toString().substring(0, 3),
                    java.util.LinkedHashMap::new,
                    Collectors.counting()))
                .entrySet().stream()
                .map(entry -> new OccupancyPointResponse(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
            }

    // ── Activity Log ──────────────────────────────────────────────

    public List<ActivityLogResponse> getRecentActivity(int limit) {
        return activityLogRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .stream()
                .map(a -> ActivityLogResponse.builder()
                        .id(a.getId())
                        .eventType(a.getEventType())
                        .description(a.getDescription())
                        .memberName(a.getMemberName())
                        .createdAt(a.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private void logActivity(String eventType, String description, String memberName) {
        try {
            activityLogRepository.save(ActivityLog.builder()
                    .eventType(eventType)
                    .description(description)
                    .memberName(memberName)
                    .createdAt(LocalDateTime.now())
                    .build());
        } catch (Exception e) {
            // never fail main operation because of logging
        }
    }

    // ── Reminder ─────────────────────────────────────────────────

    public void sendRenewalReminder(String memberEmail) {
        User user = userRepository.findByEmail(memberEmail);
        if (user == null) throw new RuntimeException("Member not found.");
        String name = user.getFirstName() + " " + user.getLastName();
        LocalDate end = user.getEndDate();
        String endStr = end != null ? end.toString() : "soon";
        mailService.sendMail(memberEmail,
                "Dear " + user.getFirstName() + ",\n\nYour IronPeak Gym membership expires on " + endStr +
                ".\n\nPlease visit the gym or contact us to renew.\n\nIronPeak Gym, Kolkata\n+91 98765 43210");
        logActivity("REMINDER", "Renewal reminder sent to " + name, name);
    }

    // ── Payments ──────────────────────────────────────────────────

    @Transactional
    public PaymentResponse recordPayment(PaymentRequest request) {
        User user = userRepository.findByEmail(request.memberEmail());
        if (user == null) throw new RuntimeException("Member not found.");
        String name = user.getFirstName() + " " + user.getLastName();
        int months = monthsForPlan(request.plan());
        LocalDate now = LocalDate.now();
        LocalDate end = user.getEndDate();
        LocalDate newEnd = (end == null || end.isBefore(now))
            ? now.plusMonths(months)
            : end.plusMonths(months);
        user.setEndDate(newEnd);
        userRepository.save(user);
        Payment payment = Payment.builder()
                .user(user)
                .memberEmail(request.memberEmail())
                .memberName(name)
                .plan(request.plan())
                .amount(request.amount())
                .paymentMode(request.paymentMode())
                .remarks(request.remarks())
                .build();
        paymentRepository.save(payment);
        logActivity("PAYMENT",
                "Payment of Rs. " + request.amount() + " received from " + name + " (" + request.plan() + ")",
                name);
        return toPaymentResponse(payment);
    }

    private int monthsForPlan(String plan) {
        return switch (plan) {
            case "1 Month" -> 1;
            case "3 Months" -> 3;
            case "6 Months" -> 6;
            case "12 Months" -> 12;
            default -> throw new IllegalArgumentException("Unsupported membership plan: " + plan);
        };
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAllByOrderByPaymentDateDesc()
                .stream().map(this::toPaymentResponse).collect(Collectors.toList());
    }

    public List<PaymentResponse> getPaymentsByMember(String email) {
        return paymentRepository.findByMemberEmailOrderByPaymentDateDesc(email)
                .stream().map(this::toPaymentResponse).collect(Collectors.toList());
    }

    private PaymentResponse toPaymentResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .receiptNumber(p.getReceiptNumber())
                .memberEmail(p.getMemberEmail())
                .memberName(p.getMemberName())
                .plan(p.getPlan())
                .amount(p.getAmount())
                .paymentMode(p.getPaymentMode())
                .paymentDate(p.getPaymentDate())
                .remarks(p.getRemarks())
                .gymName("IronPeak Gym")
                .build();
    }

    // ── CSV Export ────────────────────────────────────────────────

    public String exportMembersCsv() {
        List<MemberListResponse> members = getAllMembers();
        StringBuilder sb = new StringBuilder();
        sb.append("ID,First Name,Last Name,Email,UUID,Member Since,End Date,Status,Days Left,Inside\n");
        for (MemberListResponse m : members) {
            sb.append(String.join(",",
                    String.valueOf(m.getId()),
                    safe(m.getFirstName()), safe(m.getLastName()),
                    safe(m.getEmail()), safe(m.getUuid()),
                    m.getCreatedDate() != null ? m.getCreatedDate().toString() : "",
                    m.getEndDate() != null ? m.getEndDate().toString() : "",
                    safe(m.getStatus()),
                    String.valueOf(m.getDaysLeft()),
                    String.valueOf(m.isInside())
            )).append("\n");
        }
        return sb.toString();
    }

    private String safe(String s) {
        if (s == null) return "";
        return "\"" + s.replace("\"", "\"\"") + "\"";
    }
}
