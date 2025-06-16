package com.it.finance.personal_finance_be.adapter;

import com.it.finance.personal_finance_be.dto.TransferMovementDto;
import com.it.finance.personal_finance_be.entity.MovementEntity;
import com.it.finance.personal_finance_be.entity.TransferMovementEntityView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class TransferMovementAdapter {

    @Autowired
    private PatrimonialFundAdapter patrimonialFundAdapter;

    public TransferMovementDto toDto(TransferMovementEntityView entity) {
        if (entity == null) {
            return null; // Handle null Entity case
        }
        TransferMovementDto dto = new TransferMovementDto();
        dto.setId( entity.getId() );
        dto.setCreatedAt( entity.getCreatedAt() );
        dto.setUpdatedAt( entity.getUpdatedAt() );
        dto.setDt( entity.getDt() );
        dto.setNote( entity.getNote() );
        dto.setIdTo( entity.getIdTo() );
        dto.setPatrimonialFundTo(
            patrimonialFundAdapter.toDto( entity.getPatrimonialFundTo() )
        );
        dto.setAmount( entity.getAmount() );
        dto.setIdFrom( entity.getIdFrom() );
        dto.setPatrimonialFundFrom(
            patrimonialFundAdapter.toDto( entity.getPatrimonialFundFrom() )
        );
        return dto;
    }

    public List<TransferMovementDto> toDto( List<TransferMovementEntityView> entities ) {
        if (entities == null || entities.isEmpty()) {
            return List.of(); // Handle empty list case
        }
        return entities.stream()
                .map(this::toDto)
                .toList();
    }

    public TransferMovementDto toDtoFromMovementList(List<MovementEntity> listEntities) {

        if (listEntities == null
                || listEntities.size() != 2) {
            return null; // Handle null Entity case
        }

        Optional<MovementEntity> optMovementTo = listEntities.stream().filter(
                        e -> e.getAmount().compareTo(BigDecimal.ZERO) > 0)
                .findFirst();

        Optional<MovementEntity> optMovementFrom = listEntities.stream().filter(
                        e -> e.getAmount().compareTo(BigDecimal.ZERO) < 0)
                .findFirst();

        if(optMovementFrom.isEmpty() || optMovementTo.isEmpty()) {
            return null; // Handle case where one of the movements is not found
        }

        //

        TransferMovementDto dto = new TransferMovementDto();
        dto.setId( optMovementTo.get().getBlockId() );
        dto.setCreatedAt( optMovementTo.get().getCreatedAt() );
        dto.setUpdatedAt( optMovementTo.get().getUpdatedAt() );
        dto.setDt( optMovementTo.get().getDt() );
        dto.setNote( optMovementTo.get().getNote() );
        dto.setIdTo( optMovementTo.get().getId() );
        dto.setPatrimonialFundTo(
                patrimonialFundAdapter.toDto( optMovementTo.get().getPatrimonialFund() )
        );
        dto.setAmount( optMovementTo.get().getAmount() );
        dto.setIdFrom( optMovementFrom.get().getId() );
        dto.setPatrimonialFundFrom(
                patrimonialFundAdapter.toDto( optMovementFrom.get().getPatrimonialFund() )
        );
        return dto;
    }

    public void evaluateForEdit(MovementEntity eTo, MovementEntity eFrom, TransferMovementDto dto) {

        LocalDateTime now = LocalDateTime.now();

        eTo.setDt( dto.getDt() );
        eTo.setEconomicAccount( null );
        eTo.setNote( dto.getNote() );
        eTo.setPatrimonialFund( patrimonialFundAdapter.toEntity(dto.getPatrimonialFundTo()) );
        eTo.setAmount( dto.getAmount() );
        eTo.setUpdatedAt(now);

        eFrom.setDt( dto.getDt() );
        eFrom.setEconomicAccount( null );
        eFrom.setNote( dto.getNote() );
        eFrom.setPatrimonialFund( patrimonialFundAdapter.toEntity(dto.getPatrimonialFundFrom()) );
        eFrom.setAmount( dto.getAmount().multiply(BigDecimal.valueOf(-1)) );
        eFrom.setUpdatedAt(now);

    }

}
