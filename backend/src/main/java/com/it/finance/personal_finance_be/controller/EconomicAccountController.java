package com.it.finance.personal_finance_be.controller;

import com.it.finance.personal_finance_be.dto.EconomicAccountDto;
import com.it.finance.personal_finance_be.entity.EconomicAccountEntity;
import com.it.finance.personal_finance_be.framework.*;
import com.it.finance.personal_finance_be.service.EconomicAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/economic-accounts")
public class EconomicAccountController extends PfController<EconomicAccountEntity, EconomicAccountDto> {

    @Autowired
    private EconomicAccountService service;

    @Override
    protected PfService<EconomicAccountEntity, EconomicAccountDto> getService() {
        return service;
    }

    @Override
    @GetMapping("/id/{id}")
    public ResponseEntity<PfObjectApiResponse<EconomicAccountDto>> apiFindById(@PathVariable Long id) {
        return super.findById(id);
    }

    @Override
    @GetMapping("/all")
    public ResponseEntity<PfListApiResponse<EconomicAccountDto>> apiFindAll() {
        return super.findAll();
    }

    @Override
    @PostMapping("/search")
    public ResponseEntity<PfObjectApiResponse<SearchResponseDto<EconomicAccountDto>>> apiSearch(@RequestBody SearchRequestDto<EconomicAccountDto> searchRequest) {
        return super.search(searchRequest);
    }

    @Override
    @PostMapping("/insert")
    public ResponseEntity<PfObjectApiResponse<EconomicAccountDto>> apiInsert(@RequestBody EconomicAccountDto dto) {
        return super.insert(dto);
    }

    @Override
    @PutMapping("/edit")
    public ResponseEntity<PfObjectApiResponse<EconomicAccountDto>> apiEdit(@RequestBody EconomicAccountDto dto) {
        return super.edit(dto);
    }

    @Override
    @DeleteMapping("/id/{id}")
    public ResponseEntity<PfObjectApiResponse<Void>> apiDelete(@PathVariable Long id) {
        return super.delete(id);
    }


}
