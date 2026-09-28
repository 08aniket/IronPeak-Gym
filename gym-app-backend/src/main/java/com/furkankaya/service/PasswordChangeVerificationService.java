package com.furkankaya.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class PasswordChangeVerificationService {

    private static final long CODE_LIFETIME_SECONDS = 600;
    private static final long RESEND_DELAY_SECONDS = 60;
    private static final int MAX_ATTEMPTS = 5;

    private final MailService mailService;
    private final SecureRandom secureRandom = new SecureRandom();
    private final ConcurrentMap<String, Challenge> challenges = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, Instant> lastSentAt = new ConcurrentHashMap<>();

    @Value("${password-change.owner-email:}")
    private String ownerEmail;

    public PasswordChangeVerificationService(MailService mailService) {
        this.mailService = mailService;
    }

    public void sendCode(String adminEmail) {
        if (ownerEmail == null || ownerEmail.isBlank()) {
            throw new IllegalStateException("Password verification owner email is not configured.");
        }

        Instant now = Instant.now();
        Instant previousSend = lastSentAt.get(adminEmail);
        if (previousSend != null && now.isBefore(previousSend.plusSeconds(RESEND_DELAY_SECONDS))) {
            throw new IllegalStateException("Please wait before requesting another verification code.");
        }

        String code = String.format("%06d", secureRandom.nextInt(1_000_000));
        Challenge challenge = new Challenge(hash(code), now.plusSeconds(CODE_LIFETIME_SECONDS), 0, false);
        challenges.put(adminEmail, challenge);
        try {
            mailService.sendPasswordChangeCode(ownerEmail.trim(), code);
            lastSentAt.put(adminEmail, now);
        } catch (RuntimeException exception) {
            challenges.remove(adminEmail, challenge);
            throw new IllegalStateException("Could not send the verification code. Check SMTP settings.", exception);
        }
    }

    public void verifyCode(String adminEmail, String code) {
        if (code == null || !code.matches("\\d{6}")) {
            throw new IllegalArgumentException("Enter the six-digit owner verification code.");
        }

        Challenge challenge = challenges.get(adminEmail);
        if (challenge == null || Instant.now().isAfter(challenge.expiresAt())) {
            challenges.remove(adminEmail);
            throw new IllegalArgumentException("The verification code is missing or expired. Request a new one.");
        }
        if (challenge.verified()) {
            throw new IllegalArgumentException("The verification code has already been verified.");
        }

        if (!MessageDigest.isEqual(challenge.codeHash(), hash(code))) {
            Challenge updated = new Challenge(challenge.codeHash(), challenge.expiresAt(), challenge.attempts() + 1, false);
            if (updated.attempts() >= MAX_ATTEMPTS) {
                challenges.remove(adminEmail, challenge);
            } else {
                challenges.replace(adminEmail, challenge, updated);
            }
            throw new IllegalArgumentException("The verification code is incorrect or has expired.");
        }

        Challenge verifiedChallenge = new Challenge(challenge.codeHash(), challenge.expiresAt(), challenge.attempts(), true);
        if (!challenges.replace(adminEmail, challenge, verifiedChallenge)) {
            throw new IllegalArgumentException("The verification code has expired. Request a new one.");
        }
    }

    public void consumeVerifiedCode(String adminEmail) {
        Challenge challenge = challenges.get(adminEmail);
        if (challenge == null || Instant.now().isAfter(challenge.expiresAt()) || !challenge.verified()) {
            challenges.remove(adminEmail);
            throw new IllegalArgumentException("Verify a current owner code before changing the admin password.");
        }
        if (!challenges.remove(adminEmail, challenge)) {
            throw new IllegalArgumentException("The verification has expired. Request a new code.");
        }
    }

    private byte[] hash(String code) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(code.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available.", exception);
        }
    }

    private record Challenge(byte[] codeHash, Instant expiresAt, int attempts, boolean verified) {
    }
}