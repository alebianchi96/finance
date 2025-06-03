package com.it.finance.personal_finance_be.framework;

import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.List;

public abstract class PfService<E extends PfEntity, DTO extends PfDto> {

    protected abstract PfRepository<E> getRepository();

    protected abstract IPfAdapter<E, DTO> getAdapter();

    public abstract boolean existItem(E entity);

    public abstract boolean checkInsertFields(E entity);

    public abstract boolean checkEditFields(E entity);

    public abstract boolean checkDeleteCondition(E entity);

    public DTO findById(Long id) {
        E entity = getRepository().findById(id).orElse(null);
        return getAdapter().toDto(entity);
    }

    public List<DTO> findAll() {
        List<E> entities = getRepository().findAll();
        return getAdapter().toDto(entities);
    }

    public SearchResponseDto<DTO> search( SearchRequestDto<DTO> searchRequest ) {

        if( searchRequest == null ) {
            throw new PfUnexpectedException(400, "00", "Valore di ricerca nullo");
        }

        DTO dto = searchRequest.getDto();
        E entity = this.getAdapter().toEntity(dto);

        Example<E> example = Example.of(this.getAdapter().getEntityVoidInstance());
        if( entity != null ) {
            ExampleMatcher em = entity.generateExample();
            example = Example.of(entity, em);
        }

        Pageable pageable = PageRequest.of(
            searchRequest.getPage() - 1,
            searchRequest.getSize());
        Page<E> pagedExample = getRepository().findAll(example, pageable);

        SearchResponseDto<DTO> response = new SearchResponseDto<>();
        response.setList(this.getAdapter().toDto(pagedExample.getContent()));
        response.setPageNumber(searchRequest.getPage());
        response.setPageSize(searchRequest.getSize());
        response.setTotalElements(pagedExample.getTotalElements());
        int numberOfPages = Math.ceilDiv((int) pagedExample.getTotalElements(), searchRequest.getSize());
        response.setTotalPages(numberOfPages);

        return response;

    }

    public DTO insert(DTO dto) {

        if( dto == null ) {
            throw new PfUnexpectedException(400, "01", "Valore in inserimento nullo");
        }

        if( dto.getId() != null ) {
            throw new PfUnexpectedException(400, "02", "Valore in inserimento gia' presente per l'identificativo");
        }

        E entity = getAdapter().toEntity(dto);

        if( existItem(entity) ) {
            throw new PfUnexpectedException(400, "03", "Valore in inserimento gia' esistente");
        }

        if( !checkInsertFields(entity) ) {
            throw new PfUnexpectedException(400, "04", "Valore in inserimento non valido");
        }

        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        E savedEntity = getRepository().save(entity);
        return getAdapter().toDto(savedEntity);

    }

    public DTO edit(DTO dto) {

        if( dto == null ) {
            throw new PfUnexpectedException(400, "05", "Valore in modifica nullo");
        }

        E entity = dto.getId() == null ? null : getRepository().findById(dto.getId()).orElse(null);
        if( entity == null ) {
            throw new PfUnexpectedException(400, "06", "Valore in modifica non presente per l'identificativo");
        }

        getAdapter().evaluateForEdit(entity, dto);

        if( !checkEditFields(entity) ) {
            throw new PfUnexpectedException(400, "08", "Valore in modifica non valido");
        }

        entity.setUpdatedAt(LocalDateTime.now());

        E savedEntity = getRepository().save(entity);
        return getAdapter().toDto(savedEntity);

    }

    public void delete(Long id) {
        E entity = getRepository().findById(id).orElse(null);
        if (entity == null) {
            throw new PfUnexpectedException(400, "07", "Valore in cancellazione non presente per l'identificativo");
        }
        if( !checkDeleteCondition(entity) ) {
            throw new PfUnexpectedException(400, "09", "Non e' possibile cancellare il valore");
        }
        getRepository().delete(entity);
    }

}
