package com.FraudBreak.Backend.Entity;

import com.FraudBreak.Backend.Configs.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name = "App_User")
public class User {

    @Id
    @Column(updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private String userId;

    @NotBlank
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole roles = UserRole.USER;

}
