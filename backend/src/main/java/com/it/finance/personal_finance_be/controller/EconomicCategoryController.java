package com.it.finance.personal_finance_be.controller;

import com.it.finance.personal_finance_be.dto.EconomicCategoryDto;
import com.it.finance.personal_finance_be.entity.EconomicCategoryEntity;
import com.it.finance.personal_finance_be.framework.*;
import com.it.finance.personal_finance_be.service.EconomicCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/economic-categories")
public class EconomicCategoryController extends PfController<EconomicCategoryEntity, EconomicCategoryDto> {

    @Autowired
    private EconomicCategoryService economicCategoryService;

    @Override
    protected PfService<EconomicCategoryEntity, EconomicCategoryDto> getService() {
        return economicCategoryService;
    }

    @Override
    @GetMapping("/id/{id}")
    public ResponseEntity<PfObjectApiResponse<EconomicCategoryDto>> apiFindById(@PathVariable Long id) {
        return super.findById(id);
    }

    @Override
    @GetMapping("/all")
    public ResponseEntity<PfListApiResponse<EconomicCategoryDto>> apiFindAll() {
        return super.findAll();
    }

    @Override
    @PostMapping("/search")
    public ResponseEntity<PfObjectApiResponse<SearchResponseDto<EconomicCategoryDto>>> apiSearch(@RequestBody SearchRequestDto<EconomicCategoryDto> searchRequest) {
        return super.search(searchRequest);
    }

    @Override
    @PostMapping("/insert")
    public ResponseEntity<PfObjectApiResponse<EconomicCategoryDto>> apiInsert(@RequestBody EconomicCategoryDto dto) {
        return super.insert(dto);
    }

    @Override
    @PutMapping("/edit")
    public ResponseEntity<PfObjectApiResponse<EconomicCategoryDto>> apiEdit(@RequestBody EconomicCategoryDto dto) {
        return super.edit(dto);
    }

    @Override
    @DeleteMapping("/id/{id}")
    public ResponseEntity<PfObjectApiResponse<Void>> apiDelete(@PathVariable Long id) {
        return super.delete(id);
    }


}
