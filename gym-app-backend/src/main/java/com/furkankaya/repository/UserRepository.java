package com.furkankaya.repository;

import com.furkankaya.model.User;
import com.furkankaya.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    User findByUuid(String uuid);
    Long countByInside(Boolean inside);

    @Query("SELECT u FROM User u JOIN u.authorities a WHERE a = com.furkankaya.model.Role.ROLE_USER")
    List<User> findAllRegularUsers();

    @Query("SELECT COUNT(u) FROM User u JOIN u.authorities a WHERE a = com.furkankaya.model.Role.ROLE_USER AND u.endDate >= :now")
    Long countActiveMembers(LocalDate now);

    @Query("SELECT COUNT(u) FROM User u JOIN u.authorities a WHERE a = com.furkankaya.model.Role.ROLE_USER AND (u.endDate IS NULL OR u.endDate < :now)")
    Long countExpiredMembers(LocalDate now);

    @Query("SELECT COUNT(u) FROM User u JOIN u.authorities a WHERE a = com.furkankaya.model.Role.ROLE_USER AND u.endDate >= :now AND u.endDate <= :soon")
    Long countExpiringSoon(LocalDate now, LocalDate soon);
}
