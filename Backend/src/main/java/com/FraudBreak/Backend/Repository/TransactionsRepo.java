package com.FraudBreak.Backend.Repository;

import com.FraudBreak.Backend.Entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionsRepo extends JpaRepository <Transaction, Long>{
}
