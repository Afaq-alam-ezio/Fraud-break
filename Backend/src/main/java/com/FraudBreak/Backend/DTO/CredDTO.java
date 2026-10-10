package com.FraudBreak.Backend.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CredDTO {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 4)
    private String password;
}