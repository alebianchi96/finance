package com.it.finance.personal_finance_be.service;

import com.it.finance.personal_finance_be.adapter.MovementAdapter;
import com.it.finance.personal_finance_be.adapter.PatrimonialFundAdapter;
import com.it.finance.personal_finance_be.constants.PatrimonialFundContants;
import com.it.finance.personal_finance_be.dao.MovementJpaRepo;
import com.it.finance.personal_finance_be.dao.PatrimonialFundJpaRepo;
import com.it.finance.personal_finance_be.dto.MovementDto;
import com.it.finance.personal_finance_be.dto.PatrimonialFundDto;
import com.it.finance.personal_finance_be.dto.PatrimonialFundInitDto;
import com.it.finance.personal_finance_be.entity.MovementEntity;
import com.it.finance.personal_finance_be.entity.PatrimonialFundEntity;
import com.it.finance.personal_finance_be.framework.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PatrimonialFundService extends PfService<PatrimonialFundEntity, PatrimonialFundDto> {

    @Autowired
    private PatrimonialFundJpaRepo repository;

    @Autowired
    private MovementJpaRepo movementRepository;

    @Autowired
    private PatrimonialFundAdapter adapter;

    @Autowired
    private MovementAdapter movementAdapter;


    @Override
    protected PfRepository<PatrimonialFundEntity> getRepository() {
        return repository;
    }

    @Override
    protected IPfAdapter<PatrimonialFundEntity, PatrimonialFundDto> getAdapter() {
        return adapter;
    }

    @Override
    public boolean existItem(PatrimonialFundEntity entity) {
        // by label or code and nature
        return repository.existsByCode(entity.getCode());
    }

    @Override
    public boolean checkInsertFields(PatrimonialFundEntity entity) {
        if( !StringUtils.hasText(entity.getCode())
                || !StringUtils.hasText(entity.getLabel()))
        {
            return false;
        }
        return true;
    }

    @Override
    public boolean checkEditFields(PatrimonialFundEntity entity) {
        if( !StringUtils.hasText(entity.getCode())
                || !StringUtils.hasText(entity.getLabel()))
        {
            return false;
        }
        return true;
    }

    @Override
    public boolean checkDeleteCondition(PatrimonialFundEntity entity) {
        // exists movements with this patrimonial fund
        long numberOfLinkedEntities = movementRepository
                .countByPatrimonialFundId(entity.getId());
        return numberOfLinkedEntities == 0;

    }

    public BigDecimal sumAmountByIdAndDtLessThanEqual(Long idPatrimonialFund, LocalDateTime dtTo) {
        if( idPatrimonialFund == null || dtTo == null ) {
            throw new PfUnexpectedException(400, "00", "Valore di ricerca nullo");
        }
        dtTo = dtTo.with(LocalTime.MAX);
        return repository.sumAmountByIdAndDtLessThanEqual(idPatrimonialFund, dtTo);
    }

    public SearchResponseDto<PatrimonialFundInitDto> searchWithInit(
            SearchRequestDto<PatrimonialFundDto> searchRequest) {

        SearchResponseDto<PatrimonialFundDto> searchResult = this.search(searchRequest);

        List<PatrimonialFundInitDto> listOutput = searchResult.getList()
                .parallelStream()
                .map(pf -> {
                    MovementEntity mov = movementRepository.findSaldoInizialeByPatrimonialFundId(
                            pf.getId(), PatrimonialFundContants.INIT_NOTE);
                    return new PatrimonialFundInitDto(pf, movementAdapter.toDto(mov));
                })
                .toList();

        SearchResponseDto<PatrimonialFundInitDto> response = new SearchResponseDto<>();
        response.setList(listOutput);
        response.setPageNumber(searchResult.getPageNumber());
        response.setPageSize(searchResult.getPageSize());
        response.setTotalElements(searchResult.getTotalElements());
        response.setTotalPages(searchResult.getTotalPages());

        return response;

    }

}
