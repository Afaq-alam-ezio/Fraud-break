package com.FraudBreak.Backend.Configs.Mappers;

import com.FraudBreak.Backend.DTO.TransactionDTO;
import com.FraudBreak.Backend.Entity.Transaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapStruct {

    Transaction toEntity(TransactionDTO data);
}