package com.furkankaya.repository;

import com.furkankaya.model.InterestForm;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterestFormRepository extends JpaRepository<InterestForm, Long> {
    List<InterestForm> findAllByOrderBySubmittedAtDesc();
}
