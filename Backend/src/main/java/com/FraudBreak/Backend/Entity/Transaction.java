package com.FraudBreak.Backend.Entity;

import com.FraudBreak.Backend.Configs.TransactionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;
    private String deviceId;
    private String location;
    private String merchantCategory;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status = TransactionStatus.PENDING;

    private int riskScore;

    @Column(columnDefinition = "TEXT")
    private String aiExplanation;

    @ManyToOne                           // many Transactions can belong to one User
    @JoinColumn(name = "userId")        // the actual column name in the database
    private User user;
}
