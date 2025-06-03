package com.it.finance.personal_finance_be.framework;


import org.springframework.http.ResponseEntity;

import java.util.List;

public abstract class PfController<E extends PfEntity, DTO extends PfDto> {

    protected abstract PfService<E, DTO> getService();

    protected ResponseEntity<PfObjectApiResponse<DTO>> findById(Long id) {

        try {
            DTO dto = getService().findById(id);
            PfObjectApiResponse<DTO> resDto = PfObjectApiResponse.ok(dto);
            return ResponseEntity.ok(resDto);
        } catch (PfUnexpectedException e) {
            return ResponseEntity.ok(PfObjectApiResponse.ko(
                e.getCode(), e.getInternalCode(), e.getMessage()
            ));
        }

    }

    public abstract ResponseEntity<PfObjectApiResponse<DTO>> apiFindById(Long id);

    protected ResponseEntity<PfListApiResponse<DTO>> findAll() {
        List<DTO> dtos = getService().findAll();
        return ResponseEntity.ok(PfListApiResponse.ok(dtos));
    }

    public abstract ResponseEntity<PfListApiResponse<DTO>> apiFindAll();

    protected ResponseEntity<PfObjectApiResponse<SearchResponseDto<DTO>>> search(SearchRequestDto<DTO> searchRequest) {
        try {
            SearchResponseDto<DTO> response = getService().search(searchRequest);
            return ResponseEntity.ok(PfObjectApiResponse.ok(response));
        } catch (PfUnexpectedException e) {
            return ResponseEntity.ok(PfObjectApiResponse.ko(
                    e.getCode(), e.getInternalCode(), e.getMessage()
            ));
        }
    }

    public abstract ResponseEntity<PfObjectApiResponse<SearchResponseDto<DTO>>> apiSearch(SearchRequestDto<DTO> searchRequest);

    protected ResponseEntity<PfObjectApiResponse<DTO>> insert(DTO dto) {
        try {
            DTO savedDto = getService().insert(dto);
            return ResponseEntity.ok(PfObjectApiResponse.ok(savedDto));
        } catch (PfUnexpectedException e) {
            return ResponseEntity.ok(PfObjectApiResponse.ko(
                    e.getCode(), e.getInternalCode(), e.getMessage()
            ));
        }
    }

    public abstract ResponseEntity<PfObjectApiResponse<DTO>> apiInsert(DTO dto);

    protected ResponseEntity<PfObjectApiResponse<DTO>> edit(DTO dto) {
        try {
            DTO updatedDto = getService().edit(dto);
            return ResponseEntity.ok(PfObjectApiResponse.ok(updatedDto));
        } catch (PfUnexpectedException e) {
            return ResponseEntity.ok(PfObjectApiResponse.ko(
                    e.getCode(), e.getInternalCode(), e.getMessage()
            ));
        }
    }

    public abstract ResponseEntity<PfObjectApiResponse<DTO>> apiEdit(DTO dto);

    protected ResponseEntity<PfObjectApiResponse<Void>> delete(Long id) {
        try {
            getService().delete(id);
            return ResponseEntity.ok(PfObjectApiResponse.ok(null));
        } catch (PfUnexpectedException e) {
            return ResponseEntity.ok(PfObjectApiResponse.ko(
                    e.getCode(), e.getInternalCode(), e.getMessage()
            ));
        }
    }

    public abstract ResponseEntity<PfObjectApiResponse<Void>> apiDelete(Long id);

}
