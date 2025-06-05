package com.it.finance.personal_finance_be.controller;

import com.it.finance.personal_finance_be.dto.MovementDto;
import com.it.finance.personal_finance_be.entity.MovementEntity;
import com.it.finance.personal_finance_be.framework.*;
import com.it.finance.personal_finance_be.service.MovementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.TemporalField;

@RestController
@RequestMapping("/movements")
@CrossOrigin("*")
public class MovementController extends PfController<MovementEntity, MovementDto> {

    @Autowired
    private MovementService service;

    @Override
    protected PfService<MovementEntity, MovementDto> getService() {
        return service;
    }

    @Override
    @GetMapping("/id/{id}")
    public ResponseEntity<PfObjectApiResponse<MovementDto>> apiFindById(@PathVariable Long id) {
        return super.findById(id);
    }

    @Override
    @GetMapping("/all")
    public ResponseEntity<PfListApiResponse<MovementDto>> apiFindAll() {
        return super.findAll();
    }

    @Override
    @PostMapping("/search")
    public ResponseEntity<PfObjectApiResponse<SearchResponseDto<MovementDto>>> apiSearch(@RequestBody SearchRequestDto<MovementDto> searchRequest) {
        return super.search(searchRequest);
    }

    @Override
    @PostMapping("/insert")
    public ResponseEntity<PfObjectApiResponse<MovementDto>> apiInsert(@RequestBody MovementDto dto) {
        return super.insert(dto);
    }

    @Override
    @PutMapping("/edit")
    public ResponseEntity<PfObjectApiResponse<MovementDto>> apiEdit(@RequestBody MovementDto dto) {
        return super.edit(dto);
    }

    @Override
    @DeleteMapping("/id/{id}")
    public ResponseEntity<PfObjectApiResponse<Void>> apiDelete(@PathVariable Long id) {
        return super.delete(id);
    }


}
