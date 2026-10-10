package com.FraudBreak.Backend.Kafka.Producer;
import com.FraudBreak.Backend.DTO.TransactionDTO;
import com.FraudBreak.Backend.Entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<String> produce(
            @Valid @RequestBody TransactionDTO data,
            @AuthenticationPrincipal User user
    ){

        producerService.sendMessage(data, user);
        return new ResponseEntity<>("Message sent!", HttpStatus.OK);
    }
}
