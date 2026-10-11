package com.FraudBreak.Backend.Controller;


import com.FraudBreak.Backend.DTO.CredDTO;
import com.FraudBreak.Backend.DTO.TransactionDTO;
import com.FraudBreak.Backend.Entity.Transaction;

import com.FraudBreak.Backend.Entity.User;
import com.FraudBreak.Backend.Repository.UsersRepo;
import com.FraudBreak.Backend.Service.TransactionService;
import com.FraudBreak.Backend.Utils.JwtAuthFilter;
import com.FraudBreak.Backend.Utils.JwtUtil;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Data
@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/api/v1")
public class TransactionController {

    private final TransactionService transactionService;

    private final AuthenticationManager authenticationManager;

    private final JwtAuthFilter jwtAuthFilter;

    private final JwtUtil jwtUtil;

    private final UsersRepo usersRepo;

    private final PasswordEncoder passwordEncoder;

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions(){

         List<Transaction> data= transactionService.fetchAllTransactions();

         log.debug("Transaction list fetched is {}", data.size());

         return new ResponseEntity<>(data, HttpStatus.OK);
    }


    @GetMapping("/getTransactionsForUser")
    public ResponseEntity<?> getTransactionsForUser(
                @AuthenticationPrincipal User user
            ){

        try{

            List<Transaction> userTransactions = transactionService.getTransactionsForUser(user.getUserId());

            log.info("Data fetched is {}", userTransactions);
            return new ResponseEntity<>(userTransactions, HttpStatus.OK);
        }
        catch (Exception e){

            log.debug("Error : {}", e.getMessage());
            return new ResponseEntity<>("Error : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody CredDTO creds){

        try{

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(creds.getEmail(), creds.getPassword()));

            User user = (User) auth.getPrincipal();

            String jwtToken = jwtUtil.generateToken(creds.getEmail());

            log.info("Token created!");
            return new ResponseEntity<>(Map.of("token", jwtToken, "role", user.getRoles().name()), HttpStatus.OK);
        }
        catch (Exception e){

            log.error("Error occurred : " + e);
            return new ResponseEntity<>("Error : " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody CredDTO creds) {
        if (usersRepo.findByEmail(creds.getEmail()).isPresent()) {
            return new ResponseEntity<>("User already exists! Kindly login.", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setEmail(creds.getEmail());
        user.setPassword(passwordEncoder.encode(creds.getPassword()));
        usersRepo.save(user);

        return new ResponseEntity<>
                (Map.of("token", jwtUtil.generateToken(creds.getEmail()),
                        "role", user.getRoles().name()), HttpStatus.CREATED);
    }
}
