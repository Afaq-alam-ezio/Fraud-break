package com.FraudBreak.Backend.Service;

import com.FraudBreak.Backend.Configs.Mappers.TransactionMapStruct;
import com.FraudBreak.Backend.DTO.CredDTO;
import com.FraudBreak.Backend.DTO.TransactionDTO;
import com.FraudBreak.Backend.Entity.Transaction;
import com.FraudBreak.Backend.Repository.TransactionsRepo;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Data
public class TransactionService {

    private final TransactionsRepo transactionsRepo;
    private final TransactionMapStruct mapToStructMapper;
//    private final ModelMapper modelMapper;  outdated


    public List<Transaction> fetchAllTransactions(){

        return transactionsRepo.findAll();
    }

    public Transaction saveTransaction(TransactionDTO data) {

        Transaction saveData = mapToStructMapper.toEntity(data);

        return transactionsRepo.save(saveData);
    }

    public List<Transaction> getTransactionsForUser(String userId) {

        return transactionsRepo.findByUser_UserId(userId);
    }
}