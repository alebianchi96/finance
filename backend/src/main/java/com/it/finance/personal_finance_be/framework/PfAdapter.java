package com.it.finance.personal_finance_be.framework;

import java.util.ArrayList;
import java.util.List;

public abstract class PfAdapter<E extends PfEntity, DTO extends PfDto> implements IPfAdapter<E, DTO> {

    private final Class<E> entityClass;
    private final Class<DTO> dtoClass;

    protected PfAdapter(Class<E> entityClass, Class<DTO> dtoClass) {
        this.entityClass = entityClass;
        this.dtoClass = dtoClass;
    }

    @Override
    public E toEntity(DTO dto) {
        if( dto== null ) {
            return null; // Handle null DTO case
        }

        // declare a new instance of E
        E entity = this.getEntityVoidInstance();
        entity.setId(dto.getId());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        return entity;

    }

    @Override
    public DTO toDto(E entity) {

        if( entity== null ) {
            return null; // Handle null Entity case
        }

        // declare a new instance of DTO
        DTO dto = this.getDtoVoidInstance();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;

    }

    @Override
    public List<DTO> toDto(List<E> listEntity) {
        if (listEntity == null || listEntity.isEmpty()) {
            return new ArrayList<>(); // Return an empty list if the input is null or empty
        }
        return listEntity.stream()
                         .map(this::toDto)
                         .toList();
    }

    @Override
    public List<E> toEntity(List<DTO> listDto) {
        if (listDto == null || listDto.isEmpty()) {
            return new ArrayList<>(); // Return an empty list if the input is null or empty
        }
        return listDto.stream()
                      .map(this::toEntity)
                      .toList();
    }


    @Override
    public E getEntityVoidInstance() {
        try {
            return entityClass.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Impossibile creare una nuova istanza di " + entityClass.getName(), e);
        }
    }

    @Override
    public DTO getDtoVoidInstance() {
        try {
            return dtoClass.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Impossibile creare una nuova istanza di " + dtoClass.getName(), e);
        }
    }

}
