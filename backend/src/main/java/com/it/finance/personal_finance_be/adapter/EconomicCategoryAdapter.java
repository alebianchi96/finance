package com.it.finance.personal_finance_be.adapter;

import com.it.finance.personal_finance_be.dto.EconomicCategoryDto;
import com.it.finance.personal_finance_be.entity.EconomicCategoryEntity;
import com.it.finance.personal_finance_be.framework.PfTypoAdapter;
import org.springframework.stereotype.Component;

@Component
public class EconomicCategoryAdapter extends PfTypoAdapter<EconomicCategoryEntity, EconomicCategoryDto> {

    protected EconomicCategoryAdapter() {
        super(EconomicCategoryEntity.class, EconomicCategoryDto.class);
    }

    @Override
    public EconomicCategoryEntity toEntity(EconomicCategoryDto dto) {
        EconomicCategoryEntity entity = super.toEntity(dto);
        if (entity == null) {
            return null; // Handle null Entity case
        }
        entity.setNature(dto.getNature());
        return entity;

    }

    @Override
    public EconomicCategoryDto toDto(EconomicCategoryEntity entity) {
        EconomicCategoryDto dto = super.toDto(entity);
        if (dto == null) {
            return null; // Handle null DTO case
        }
        dto.setNature(entity.getNature());
        return dto;
    }


    @Override
    public void evaluateForEdit(EconomicCategoryEntity entity, EconomicCategoryDto dto) {
        entity.setNature( dto.getNature() );
        entity.setLabel( dto.getLabel() );
        entity.setCode( dto.getCode() );
    }

}
