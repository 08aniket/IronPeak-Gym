package com.furkankaya.repository;

import com.furkankaya.model.OccupancyEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OccupancyEventRepository extends JpaRepository<OccupancyEvent, Long> {
    List<OccupancyEvent> findByOccurredAtAfterOrderByOccurredAtAsc(LocalDateTime since);
}
