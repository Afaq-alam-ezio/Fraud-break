package com.FraudBreak.Backend.Repository;

import com.FraudBreak.Backend.DTO.CredDTO;
import com.FraudBreak.Backend.Entity.Transaction;
import com.FraudBreak.Backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionsRepo extends JpaRepository <Transaction, Long>{

    List<Transaction> findByUser_UserId(String userId);
}
