package com.furkankaya.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsResponse {
    private long totalMembers;
    private long activeMembers;
    private long expiredMembers;
    private long expiringSoon;   // within 10 days
    private long insideNow;
    private long revenueThisMonth;
    private String revenueTrend;
}
