package com.it.finance.personal_finance_be.adapter;

import com.it.finance.personal_finance_be.dto.PatrimonialFundDto;
import com.it.finance.personal_finance_be.entity.PatrimonialFundEntity;
import com.it.finance.personal_finance_be.framework.PfTypoAdapter;
import org.springframework.stereotype.Component;

@Component
public class PatrimonialFundAdapter extends PfTypoAdapter<PatrimonialFundEntity, PatrimonialFundDto> {

    protected PatrimonialFundAdapter() {
        super(PatrimonialFundEntity.class, PatrimonialFundDto.class);
    }

    @Override
    public PatrimonialFundEntity toEntity(PatrimonialFundDto dto) {
        PatrimonialFundEntity entity = super.toEntity(dto);
        if (entity == null) {
            return null; // Handle null Entity case
        }
        return entity;

    }

    @Override
    public PatrimonialFundDto toDto(PatrimonialFundEntity entity) {
        PatrimonialFundDto dto = super.toDto(entity);
        if (dto == null) {
            return null; // Handle null DTO case
        }
        return dto;
    }


    @Override
    public void evaluateForEdit(PatrimonialFundEntity entity, PatrimonialFundDto dto) {
        entity.setLabel( dto.getLabel() );
        entity.setCode( dto.getCode() );
    }

}
