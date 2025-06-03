package com.it.finance.personal_finance_be.framework;

import java.util.List;

public interface IPfAdapter<E extends PfEntity, D extends PfDto> {

    public E getEntityVoidInstance();

    public D getDtoVoidInstance();

    public D toDto(E entity);

    public E toEntity(D dto);

    public List<D> toDto(List<E> listEntity);

    public List<E> toEntity(List<D> listDto);

    void evaluateForEdit(E entity, D dto);

}
