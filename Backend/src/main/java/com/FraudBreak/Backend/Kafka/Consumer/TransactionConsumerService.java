package com.FraudBreak.Backend.Kafka.Consumer;


import com.FraudBreak.Backend.Configs.TransactionStatus;

import com.FraudBreak.Backend.Entity.Transaction;
import com.FraudBreak.Backend.Repository.TransactionsRepo;
import com.FraudBreak.Backend.Service.FraudScoreViaRedis;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionConsumerService {

    private volatile Transaction fetchedMessage;

    private final FraudScoreViaRedis redisScoringService;

    private final TransactionsRepo transactionsRepo;

    private final ChatClient chatClient;


    @KafkaListener(groupId = "fraud-scoring", topics = "transactions")
    public void fetchMessage(Transaction data){



        List<Long> countedData = redisScoringService.getFraudCounts(data);

        int finalRiskScore = redisScoringService.getFinalRiskScore(countedData);
        data.setRiskScore(finalRiskScore);

        String prompt = String.format("""
            You are a fraud analyst assistant. A transaction was flagged as suspicious.
        
            Risk score: %d out of 100
            Transactions by this user in the last 60 seconds: %d
            Distinct cities used in the last 40 minutes: %d
            Distinct devices used in the last 40 minutes: %d
        
            In 2-3 short sentences, explain in plain English why this looks suspicious.
            Give only the final explanation, no reasoning steps.
            """, finalRiskScore, countedData.get(0), countedData.get(1), countedData.get(2));


        data.setStatus(finalRiskScore >= 65 ? TransactionStatus.SUSPICIOUS : TransactionStatus.CLEAN);

        if (data.getStatus().equals(TransactionStatus.CLEAN)) {

            data.setAiExplanation("All good, nothing suspicious.");
        }
        else {

            String aiResponse = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();

            String cleanExplanation = aiResponse.replaceAll("(?s)<think>.*?</think>", "").trim();
            data.setAiExplanation(cleanExplanation);

        }

        fetchedMessage = transactionsRepo.save(data);

        log.info("Final data stored in DB is : {}", fetchedMessage);

    }

    public Transaction getMessage(){

        log.info("Fetched message is {}", fetchedMessage);
        return fetchedMessage;
    }
}
