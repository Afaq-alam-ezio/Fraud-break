package com.FraudBreak.Backend.Kafka.Producer;

import com.FraudBreak.Backend.Configs.Mappers.TransactionMapStruct;
import com.FraudBreak.Backend.DTO.TransactionDTO;
import com.FraudBreak.Backend.Entity.Transaction;
import com.FraudBreak.Backend.Repository.TransactionsRepo;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionProducerService {

    private final KafkaTemplate<String, Transaction> kafkaTemplate;
    private final TransactionMapStruct mapToStructMapper;
    private final TransactionsRepo transactionsRepo;

    public void sendMessage(TransactionDTO data) {

        Transaction messageData = mapToStructMapper.toEntity(data);

        Transaction savedData = transactionsRepo.save(messageData);

        kafkaTemplate.send(
                "transactions",
                String.valueOf(savedData.getUser().getUserId()),
                savedData
        );

        log.info("Message sent to kafka is : {}", data);
    }
}
