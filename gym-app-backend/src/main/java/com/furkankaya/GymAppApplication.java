package com.furkankaya;

import com.furkankaya.config.PasswordEncoderConfig;
import com.furkankaya.model.Price;
import com.furkankaya.model.Role;
import com.furkankaya.model.User;
import com.furkankaya.repository.PriceRepository;
import com.furkankaya.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Collections;

@SpringBootApplication(scanBasePackages = "com.furkankaya")
@RequiredArgsConstructor
public class GymAppApplication implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PriceRepository priceRepository;
	private final PasswordEncoderConfig passwordEncoderConfig;
	@Value("${app.admin.email}")
	private String adminEmail;
	@Value("${app.admin.password}")
	private String adminPassword;

	public static void main(String[] args) {
		SpringApplication.run(GymAppApplication.class, args);
	}

	@Override
	@Transactional
	public void run(String... args) {

		// ── Seed admin user ───────────────────────────────────────
		User admin = userRepository.findByEmail(adminEmail);
		if (admin == null) {
			admin = new User();
			admin.setPassword(passwordEncoderConfig.passwordEncoder().encode(adminPassword));
			admin.setFirstName("Aniket");
			admin.setLastName("Shaw");
			admin.setEmail(adminEmail);
			admin.setInside(false);
			admin.setAccountNonExpired(true);
			admin.setAccountNonLocked(true);
			admin.setCredentialsNonExpired(true);
			// isEnabled defaults to true in User model — no setter needed
			admin.setAuthorities(Collections.singleton(Role.ROLE_ADMIN));
			userRepository.save(admin);
		}

		// ── Seed default prices ───────────────────────────────────
		Price price = priceRepository.findById(100L).orElse(null);
		if (price == null) {
			price = new Price();
			price.setId(100L);
			price.setOneMonths(1200L);
			price.setThreeMonths(3000L);
			price.setSixMonths(5500L);
			price.setTwelveMonths(9999L);
			priceRepository.save(price);
		}
	}
}
