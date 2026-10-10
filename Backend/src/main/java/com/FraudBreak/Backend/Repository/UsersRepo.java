package com.FraudBreak.Backend.Repository;

import com.FraudBreak.Backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepo extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);
}
