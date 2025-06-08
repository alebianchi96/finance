package com.it.finance.personal_finance_be.service;

import com.it.finance.personal_finance_be.adapter.MovementAdapter;
import com.it.finance.personal_finance_be.dao.MovementJpaRepo;
import com.it.finance.personal_finance_be.dto.MovementDto;
import com.it.finance.personal_finance_be.dto.PatrimonialFundDto;
import com.it.finance.personal_finance_be.entity.MovementEntity;
import com.it.finance.personal_finance_be.framework.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class MovementService extends PfService<MovementEntity, MovementDto> {

    @Autowired
    private MovementJpaRepo repository;

    @Autowired
    private MovementAdapter adapter;

    @Override
    protected PfRepository<MovementEntity> getRepository() {
        return repository;
    }

    @Override
    protected IPfAdapter<MovementEntity, MovementDto> getAdapter() {
        return adapter;
    }

    @Override
    public boolean existItem(MovementEntity entity) {
        return false;
    }

    @Override
    public boolean checkInsertFields(MovementEntity entity) {
        if( entity.getDt()==null
                || entity.getAmount()== null
                || entity.getPatrimonialFund() == null
                || entity.getPatrimonialFund().getId() == null
                || entity.getBlockId() == null )
        {
            return false;
        }
        return true;
    }

    @Override
    public boolean checkEditFields(MovementEntity entity) {
        if( entity.getDt()==null
                || entity.getAmount()== null
                || entity.getPatrimonialFund() == null
                || entity.getPatrimonialFund().getId() == null
                || entity.getBlockId() == null )
        {
            return false;
        }
        return true;
    }

    @Override
    public boolean checkDeleteCondition(MovementEntity entity) {
        boolean existsLinkedMovement = repository.existsByBlockIdAndIdNot(entity.getBlockId(), entity.getId());
        return !existsLinkedMovement;
    }

    public SearchResponseDto<MovementDto> searchEconomics(SearchRequestDto<MovementDto> searchRequest) {
        return searchEconomicsOrTransfers(searchRequest, true);
    }


    public SearchResponseDto<MovementDto> searchTransfers(SearchRequestDto<MovementDto> searchRequest) {
        return searchEconomicsOrTransfers(searchRequest, false);
    }


    private SearchResponseDto<MovementDto> searchEconomicsOrTransfers(SearchRequestDto<MovementDto> searchRequest, boolean economics) {
        if( searchRequest == null ) {
            throw new PfUnexpectedException(400, "00", "Valore di ricerca nullo");
        }

        // prendo gli ultimi 20 in un modo o nell'altro per il dato idPatrimonialFund e precenti o uguali da data fornita
        MovementDto movDtoRequest = searchRequest.getDto();
        PatrimonialFundDto patrimonialFundDto = movDtoRequest != null ? movDtoRequest.getPatrimonialFund() : null;
        Long idPatrimonialFund = patrimonialFundDto != null ? patrimonialFundDto.getId() : null;

        if( idPatrimonialFund == null ) {
            throw new PfUnexpectedException(400, "01", "Valore di ricerca nullo per fondo patrimoniale");
        }

        LocalDateTime dtTo = movDtoRequest.getDt() != null ? movDtoRequest.getDt() : LocalDateTime.now();
        dtTo = dtTo.with(LocalTime.MAX);

        Pageable pageable = PageRequest.of(0, 20);

        List<MovementEntity> lst;
        if(economics) {
            lst = repository.listLatestEconomicsByPatrimonialFundAndDtLessThanEqual(idPatrimonialFund, dtTo, pageable);
        } else {
            lst = repository.listLatestTransfersByPatrimonialFundAndDtLessThanEqual(idPatrimonialFund, dtTo, pageable);
        }

        SearchResponseDto<MovementDto> response = new SearchResponseDto<>();
        response.setList(this.getAdapter().toDto(lst));
        response.setPageNumber(1);
        response.setPageSize(20);
        response.setTotalElements(20);
        response.setTotalPages(1);

        return response;
    }

}
