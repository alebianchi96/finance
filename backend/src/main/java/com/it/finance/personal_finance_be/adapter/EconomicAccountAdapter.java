package com.it.finance.personal_finance_be.adapter;

import com.it.finance.personal_finance_be.dto.EconomicAccountDto;
import com.it.finance.personal_finance_be.entity.EconomicAccountEntity;
import com.it.finance.personal_finance_be.framework.PfTypoAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EconomicAccountAdapter extends PfTypoAdapter<EconomicAccountEntity, EconomicAccountDto> {

    protected EconomicAccountAdapter() {
        super(EconomicAccountEntity.class, EconomicAccountDto.class);
    }

    @Autowired
    private EconomicCategoryAdapter economicCategoryAdapter;

    @Override
    public EconomicAccountEntity toEntity(EconomicAccountDto dto) {
        EconomicAccountEntity entity = super.toEntity(dto);
        if (entity == null) {
            return null; // Handle null Entity case
        }
        entity.setEconomicCategory( economicCategoryAdapter.toEntity(dto.getEconomicCategory()) );
        return entity;

    }

    @Override
    public EconomicAccountDto toDto(EconomicAccountEntity entity) {
        EconomicAccountDto dto = super.toDto(entity);
        if (dto == null) {
            return null; // Handle null DTO case
        }
        dto.setEconomicCategory( economicCategoryAdapter.toDto(entity.getEconomicCategory()) );
        return dto;
    }


    @Override
    public void evaluateForEdit(EconomicAccountEntity entity, EconomicAccountDto dto) {
        entity.setCode( dto.getCode() );
        entity.setLabel( dto.getLabel() );
        entity.setEconomicCategory( economicCategoryAdapter.toEntity(dto.getEconomicCategory()) );
    }

}
