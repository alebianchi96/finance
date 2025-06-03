package com.it.finance.personal_finance_be.framework;

public abstract class PfTypoAdapter<E extends PfTypoEntity, DTO extends PfTypoDto> extends PfAdapter<E, DTO> {

    protected PfTypoAdapter(Class<E> entityClass, Class<DTO> dtoClass) {
        super(entityClass, dtoClass);
    }

    @Override
    public E toEntity(DTO dto) {
        E entity = super.toEntity(dto);
        if (entity == null) {
            return null; // Handle null Entity case
        }
        entity.setLabel(dto.getLabel());
        entity.setCode(dto.getCode());
        return entity;

    }

    @Override
    public DTO toDto(E entity) {
        DTO dto = super.toDto(entity);
        if (dto == null) {
            return null; // Handle null DTO case
        }
        dto.setLabel(entity.getLabel());
        dto.setCode(entity.getCode());
        return dto;
    }

}
