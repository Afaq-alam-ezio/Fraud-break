package com.FraudBreak.Backend.Controller;

import com.FraudBreak.Backend.DTO.TransactionDTO;
import com.FraudBreak.Backend.Entity.Transaction;
import com.FraudBreak.Backend.Service.TransactionService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Data
@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/api/v1")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions(){

         List<Transaction> data= transactionService.fetchAllTransactions();

         log.debug("Transaction list fetched is {}", data);

         return new ResponseEntity<>(data, HttpStatus.OK);
    }

    // below method was just for testing
    @PostMapping("/newTransaction")
    public ResponseEntity<Transaction> createTransaction(
            @Valid @RequestBody TransactionDTO data
    ){

        Transaction savedData = transactionService.saveTransaction(data);

        log.debug("Data saved is : {}", savedData);

        return new ResponseEntity<>(savedData, HttpStatus.CREATED);
    }
}
