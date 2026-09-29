package com.furkankaya;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.furkankaya.dto.MemberListResponse;
import com.furkankaya.model.ActivityLog;
import com.furkankaya.model.OccupancyEvent;
import com.furkankaya.model.Payment;
import com.furkankaya.model.Role;
import com.furkankaya.model.User;
import com.furkankaya.repository.ActivityLogRepository;
import com.furkankaya.repository.InterestFormRepository;
import com.furkankaya.repository.OccupancyEventRepository;
import com.furkankaya.repository.PaymentRepository;
import com.furkankaya.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:gymtest;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
		"spring.datasource.username=sa",
		"spring.datasource.password=",
		"spring.jpa.hibernate.ddl-auto=create-drop",
		"spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
@AutoConfigureMockMvc
class GymAppApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private OccupancyEventRepository occupancyEventRepository;

	@Autowired
	private ActivityLogRepository activityLogRepository;

	@Autowired
	private InterestFormRepository interestFormRepository;

	@BeforeEach
	void clearTestData() {
		paymentRepository.deleteAll();
		occupancyEventRepository.deleteAll();
		activityLogRepository.deleteAll();
		interestFormRepository.deleteAll();
		userRepository.deleteAll();
	}

	@Test
	void contextLoads() {
	}

	@Test
	@WithMockUser(roles = "ADMIN")
	void paymentCreatesReceiptAndExtendsExpiredMembership() throws Exception {
		User member = saveMember("payment-member@example.com", LocalDate.now().minusDays(1), "payment-uuid");
		String request = """
				{"memberEmail":"payment-member@example.com","plan":"1 Month","amount":1200,"paymentMode":"UPI"}
				""";

		mockMvc.perform(post("/api/v1/payments")
					.contentType(MediaType.APPLICATION_JSON)
					.content(request))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.receiptNumber", startsWith("IP-")))
				.andExpect(jsonPath("$.memberName").value("Test Member"))
				.andExpect(jsonPath("$.amount").value(1200));

		User updatedMember = userRepository.findById(member.getId()).orElseThrow();
		assertThat(updatedMember.getEndDate()).isEqualTo(LocalDate.now().plusMonths(1));

		Payment savedPayment = paymentRepository.findByMemberEmailOrderByPaymentDateDesc(member.getEmail()).get(0);
		assertThat(savedPayment.getReceiptNumber()).startsWith("IP-");
		assertThat(savedPayment.getPaymentDate()).isEqualTo(LocalDate.now());
	}

	@Test
	@WithMockUser(roles = "USER")
	void regularUserCannotReadAdminPayments() throws Exception {
		mockMvc.perform(get("/api/v1/payments")).andExpect(status().isForbidden());
	}

	@Test
	@WithMockUser(roles = "ADMIN")
	void adminCanReadPayments() throws Exception {
		mockMvc.perform(get("/api/v1/payments"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());
	}

	@Test
	void publicCanSubmitInterestForm() throws Exception {
		mockMvc.perform(post("/api/v1/interest")
					.contentType(MediaType.APPLICATION_JSON)
					.content("""
							{"fullName":"Demo Visitor","email":"visitor@example.com","phone":"1234567890","age":"25"}
							"""))
				.andExpect(status().isOk());

		assertThat(interestFormRepository.count()).isEqualTo(1);
	}

	@Test
	void memberCannotReadInterestSubmissions() throws Exception {
		mockMvc.perform(get("/api/v1/interest").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user("member").roles("USER")))
				.andExpect(status().isForbidden());
	}

	@Test
	void adminCanReadInterestSubmissions() throws Exception {
		mockMvc.perform(get("/api/v1/interest").with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user("admin").roles("ADMIN")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());
	}

	@Test
	@WithMockUser(roles = "ADMIN")
	void memberListReflectsExpiryStatusTransitions() throws Exception {
		saveMember("expired@example.com", LocalDate.now().minusDays(1), "expired-uuid");
		saveMember("expiring@example.com", LocalDate.now().plusDays(5), "expiring-uuid");
		saveMember("active@example.com", LocalDate.now().plusDays(30), "active-uuid");

		MvcResult result = mockMvc.perform(get("/api/v1/members"))
				.andExpect(status().isOk())
				.andReturn();
		List<MemberListResponse> members = objectMapper.readValue(
				result.getResponse().getContentAsString(), new TypeReference<>() {});

		assertThat(members).extracting(MemberListResponse::getStatus)
				.containsExactlyInAnyOrder("EXPIRED", "EXPIRING_SOON", "ACTIVE");
	}

	@Test
	void nfcAccessTogglesEntryAndExitAndRecordsEvents() throws Exception {
		User member = saveMember("nfc-member@example.com", LocalDate.now().plusDays(30), "nfc-valid-uuid");
		String request = "{\"uuid\":\"nfc-valid-uuid\"}";

		mockMvc.perform(post("/api/v1/isAllowedToPass")
					.contentType(MediaType.APPLICATION_JSON)
					.content(request))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").value(true));
		assertThat(userRepository.findById(member.getId()).orElseThrow().isInside()).isTrue();

		mockMvc.perform(post("/api/v1/isAllowedToPass")
					.contentType(MediaType.APPLICATION_JSON)
					.content(request))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").value(true));
		assertThat(userRepository.findById(member.getId()).orElseThrow().isInside()).isFalse();
		assertThat(occupancyEventRepository.findAll()).extracting(OccupancyEvent::getEventType)
				.containsExactlyInAnyOrder("CHECK_IN", "CHECK_OUT");
	}

	@Test
	void nfcAccessRejectsExpiredMembership() throws Exception {
		saveMember("expired-nfc@example.com", LocalDate.now().minusDays(1), "nfc-expired-uuid");

		mockMvc.perform(post("/api/v1/isAllowedToPass")
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"uuid\":\"nfc-expired-uuid\"}"))
				.andExpect(status().isForbidden());
		assertThat(occupancyEventRepository.count()).isZero();
	}

	private User saveMember(String email, LocalDate endDate, String uuid) {
		return userRepository.save(User.builder()
				.firstName("Test")
				.lastName("Member")
				.email(email)
				.password("unused-test-password")
				.authorities(Set.of(Role.ROLE_USER))
				.endDate(endDate)
				.uuid(uuid)
				.build());
	}

}
