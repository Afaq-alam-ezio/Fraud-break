package com.FraudBreak.Backend.DTO;

import com.FraudBreak.Backend.Configs.TransactionStatus;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO{

    @Positive
    private BigDecimal amount;

    @NotBlank
    private String deviceId;

    @NotBlank
    private String location;

    @NotBlank
    private String merchantCategory;

//    @NotNull
//    private LocalDateTime timestamp;
//
//    @Nullable
//    TransactionStatus status;
}
