package com.FraudBreak.Backend.Kafka.Consumer;

import com.FraudBreak.Backend.Entity.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kafka")
@RequiredArgsConstructor
public class TransactionConsumerController {

    private final TransactionConsumerService consumerService;

    @GetMapping("/getMessage")
    public ResponseEntity<Transaction> fetchMessage(){

        return new ResponseEntity<>(consumerService.getMessage(), HttpStatus.OK);
    }
}
