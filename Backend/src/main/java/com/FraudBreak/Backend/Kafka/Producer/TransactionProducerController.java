package com.FraudBreak.Backend.Kafka.Producer;
import com.FraudBreak.Backend.DTO.TransactionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kafka")
@RequiredArgsConstructor
public class TransactionProducerController {

    private final TransactionProducerService producerService;

    @PostMapping("/create")
    public ResponseEntity<String> produce(@RequestBody TransactionDTO data){

        producerService.sendMessage(data);
        return new ResponseEntity<>("Message sent!", HttpStatus.OK);
    }
}
