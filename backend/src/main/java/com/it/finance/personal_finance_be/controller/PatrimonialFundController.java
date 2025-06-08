package com.it.finance.personal_finance_be.controller;

import com.it.finance.personal_finance_be.dto.PatrimonialFundDto;
import com.it.finance.personal_finance_be.entity.PatrimonialFundEntity;
import com.it.finance.personal_finance_be.framework.*;
import com.it.finance.personal_finance_be.service.PatrimonialFundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/patrimonial-funds")
@CrossOrigin("*")
public class PatrimonialFundController extends PfController<PatrimonialFundEntity, PatrimonialFundDto> {

    @Autowired
    private PatrimonialFundService service;

    @Override
    protected PfService<PatrimonialFundEntity, PatrimonialFundDto> getService() {
        return service;
    }

    @Override
    @GetMapping("/id/{id}")
    public ResponseEntity<PfObjectApiResponse<PatrimonialFundDto>> apiFindById(@PathVariable Long id) {
        return super.findById(id);
    }

    @Override
    @GetMapping("/all")
    public ResponseEntity<PfListApiResponse<PatrimonialFundDto>> apiFindAll() {
        return super.findAll();
    }

    @Override
    @PostMapping("/search")
    public ResponseEntity<PfObjectApiResponse<SearchResponseDto<PatrimonialFundDto>>> apiSearch(@RequestBody SearchRequestDto<PatrimonialFundDto> searchRequest) {
        return super.search(searchRequest);
    }

    @Override
    @PostMapping("/insert")
    public ResponseEntity<PfObjectApiResponse<PatrimonialFundDto>> apiInsert(@RequestBody PatrimonialFundDto dto) {
        return super.insert(dto);
    }

    @Override
    @PutMapping("/edit")
    public ResponseEntity<PfObjectApiResponse<PatrimonialFundDto>> apiEdit(@RequestBody PatrimonialFundDto dto) {
        return super.edit(dto);
    }

    @Override
    @DeleteMapping("/id/{id}")
    public ResponseEntity<PfObjectApiResponse<Void>> apiDelete(@PathVariable Long id) {
        return super.delete(id);
    }

    @GetMapping("/fund/{id}/at/{dtTimestamp}")
    public ResponseEntity<PfObjectApiResponse<BigDecimal>> apiFundAmountByIdAtDate(
            @PathVariable Long id,
            @PathVariable Long dtTimestamp
    ) {

        LocalDateTime dt = LocalDateTime.ofEpochSecond(dtTimestamp / 1000, 0, java.time.ZoneOffset.UTC);

        try {
            BigDecimal amount = service.sumAmountByIdAndDtLessThanEqual(id, dt);
            return ResponseEntity.ok(PfObjectApiResponse.ok(amount));
        } catch (PfUnexpectedException e) {
            return ResponseEntity.ok(PfObjectApiResponse.ko(
                    e.getCode(), e.getInternalCode(), e.getMessage()
            ));
        }
    }

}
