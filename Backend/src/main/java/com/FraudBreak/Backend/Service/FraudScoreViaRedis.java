package com.FraudBreak.Backend.Service;

import com.FraudBreak.Backend.DTO.TransactionDTO;
import com.FraudBreak.Backend.Entity.Transaction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class FraudScoreViaRedis {

    private final StringRedisTemplate redisTemplate;

    private static final int TRANSACTION_WINDOW_SECONDS = 60;
    private static final int MAX_TRANSACTIONS = 3;

    private static final int LOCATION_DEVICE_WINDOW_MINUTES = 40;

    public List<Long> getFraudCounts(Transaction data) {

        String userId = data.getUser().getUserId();
        long now = System.currentTimeMillis();

        // ---------- 1. Transaction count, last 60 seconds ----------
        // Same logic you already built. Random label each time, so every
        // hit counts separately — we want TOTAL count here, not distinct.
        String transactionKey = "user:" + userId + ":transactions";
        long transactionWindowStart = now - (TRANSACTION_WINDOW_SECONDS * 1000L);

        redisTemplate.opsForZSet().add(transactionKey, UUID.randomUUID().toString(), now);
        redisTemplate.opsForZSet().removeRangeByScore(transactionKey, 0, transactionWindowStart);
        Long transactionCount = redisTemplate.opsForZSet().zCard(transactionKey);
        redisTemplate.expire(transactionKey, TRANSACTION_WINDOW_SECONDS, TimeUnit.SECONDS);

        // ---------- 2. Distinct cities, last 40 minutes ----------
        // Window is bigger here: 40 minutes instead of 60 seconds.
        String cityKey = "user:" + userId + ":cities";
        long locationDeviceWindowStart = now - (LOCATION_DEVICE_WINDOW_MINUTES * 60 * 1000L);

        // Label is the CITY NAME itself, not random. So if "Pune" shows up
        // again, Redis just updates its time instead of adding a second
        // entry. Counting the list now means "how many DIFFERENT cities",
        // not "how many times".
        redisTemplate.opsForZSet().add(cityKey, data.getLocation(), now);
        redisTemplate.opsForZSet().removeRangeByScore(cityKey, 0, locationDeviceWindowStart);
        Long distinctCityCount = redisTemplate.opsForZSet().zCard(cityKey);
        redisTemplate.expire(cityKey, LOCATION_DEVICE_WINDOW_MINUTES * 60, TimeUnit.SECONDS);

        // ---------- 3. Distinct devices, last 40 minutes ----------
        // Exact same trick as cities, just using the device ID as the label.
        String deviceKey = "user:" + userId + ":devices";

        redisTemplate.opsForZSet().add(deviceKey, data.getDeviceId(), now);
        redisTemplate.opsForZSet().removeRangeByScore(deviceKey, 0, locationDeviceWindowStart);
        Long distinctDeviceCount = redisTemplate.opsForZSet().zCard(deviceKey);
        redisTemplate.expire(deviceKey, LOCATION_DEVICE_WINDOW_MINUTES * 60, TimeUnit.SECONDS);

        log.debug("User {} -> transactions: {}, cities: {}, devices: {}",
                userId, transactionCount, distinctCityCount, distinctDeviceCount);

        return List.of(transactionCount, distinctCityCount, distinctDeviceCount);
    }


    public int calculateRiskScore(List<Long> data) {
        int score = 0;

        if (data.get(1) > 1) {
            score += 25;
        }
        if (data.get(2) > 3) {
            score += 40;
        }
        return score;
    }


    public int getFinalRiskScore(List<Long> data) {
        // Too many transactions is bad enough on its own — flag right away.
        if (data.get(0) > MAX_TRANSACTIONS) {
            return 100;
        }
        // Otherwise, go by the points total.
        return calculateRiskScore(data);
    }
}