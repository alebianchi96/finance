package com.it.finance.personal_finance_be.adapter;

import com.it.finance.personal_finance_be.dto.MovementDto;
import com.it.finance.personal_finance_be.entity.MovementEntity;
import com.it.finance.personal_finance_be.framework.PfAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MovementAdapter extends PfAdapter<MovementEntity, MovementDto> {

    @Autowired
    private EconomicAccountAdapter economicAccountAdapter;

    @Autowired
    private PatrimonialFundAdapter patrimonialFundAdapter;

    protected MovementAdapter() {
        super(MovementEntity.class, MovementDto.class);
    }

    @Override
    public MovementEntity toEntity(MovementDto dto) {
        MovementEntity entity = super.toEntity(dto);
        if (entity == null) {
            return null; // Handle null Entity case
        }
        entity.setDt( dto.getDt() );
        entity.setEconomicAccount( economicAccountAdapter.toEntity(dto.getEconomicAccount()) );
        entity.setNote( dto.getNote());
        entity.setPatrimonialFund( patrimonialFundAdapter.toEntity(dto.getPatrimonialFund()) );
        entity.setAmount( dto.getAmount() );
        entity.setBlockId( dto.getBlockId() );
        return entity;

    }

    @Override
    public MovementDto toDto(MovementEntity entity) {
        MovementDto dto = super.toDto(entity);
        if (dto == null) {
            return null; // Handle null DTO case
        }
        dto.setDt( entity.getDt() );
        dto.setEconomicAccount( economicAccountAdapter.toDto(entity.getEconomicAccount()) );
        dto.setNote( entity.getNote() );
        dto.setPatrimonialFund( patrimonialFundAdapter.toDto(entity.getPatrimonialFund()) );
        dto.setAmount( entity.getAmount() );
        dto.setBlockId( entity.getBlockId() );
        return dto;
    }


    @Override
    public void evaluateForEdit(MovementEntity entity, MovementDto dto) {
        entity.setDt( dto.getDt() );
        entity.setEconomicAccount( economicAccountAdapter.toEntity(dto.getEconomicAccount()) );
        entity.setNote( dto.getNote() );
        entity.setPatrimonialFund( patrimonialFundAdapter.toEntity(dto.getPatrimonialFund()) );
        entity.setAmount( dto.getAmount() );
    }

}
