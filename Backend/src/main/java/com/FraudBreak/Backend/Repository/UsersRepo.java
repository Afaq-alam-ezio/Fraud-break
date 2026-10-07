package com.FraudBreak.Backend.Repository;

import com.FraudBreak.Backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepo extends JpaRepository<User, String> {
}
