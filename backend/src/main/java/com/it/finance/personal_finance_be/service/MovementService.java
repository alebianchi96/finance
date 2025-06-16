package com.it.finance.personal_finance_be.service;

import com.it.finance.personal_finance_be.adapter.MovementAdapter;
import com.it.finance.personal_finance_be.adapter.PatrimonialFundAdapter;
import com.it.finance.personal_finance_be.adapter.TransferMovementAdapter;
import com.it.finance.personal_finance_be.dao.MovementJpaRepo;
import com.it.finance.personal_finance_be.dao.TransferMovementJpaRepo;
import com.it.finance.personal_finance_be.dto.MovementDto;
import com.it.finance.personal_finance_be.dto.PatrimonialFundDto;
import com.it.finance.personal_finance_be.dto.TransferMovementDto;
import com.it.finance.personal_finance_be.entity.EconomicAccountEntity;
import com.it.finance.personal_finance_be.entity.MovementEntity;
import com.it.finance.personal_finance_be.entity.PatrimonialFundEntity;
import com.it.finance.personal_finance_be.entity.TransferMovementEntityView;
import com.it.finance.personal_finance_be.framework.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
public class MovementService extends PfService<MovementEntity, MovementDto> {

    @Autowired
    private MovementJpaRepo repository;

    @Autowired
    private MovementAdapter adapter;

    @Autowired
    private TransferMovementAdapter transferMovementAdapter;

    @Autowired
    private PatrimonialFundAdapter patrimonialFundAdapter;

    @Autowired
    private TransferMovementJpaRepo transferMovementRepository;


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
                || BigDecimal.ZERO.equals(entity.getAmount())
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

        List<MovementEntity> lst = repository.listLatestEconomicsByPatrimonialFundAndDtLessThanEqual(
                idPatrimonialFund, dtTo, pageable);

        SearchResponseDto<MovementDto> response = new SearchResponseDto<>();
        response.setList(this.getAdapter().toDto(lst));
        response.setPageNumber(1);
        response.setPageSize(20);
        response.setTotalElements(20);
        response.setTotalPages(1);

        return response;
    }


    public SearchResponseDto<TransferMovementDto> searchTransfers(SearchRequestDto<TransferMovementDto> searchRequest) {
        if( searchRequest == null ) {
            throw new PfUnexpectedException(400, "00", "Valore di ricerca nullo");
        }

        // prendo gli ultimi 20 in un modo o nell'altro per il dato idPatrimonialFund e precenti o uguali da data fornita
        TransferMovementDto movDtoRequest = searchRequest.getDto();
        LocalDateTime dtTo = movDtoRequest.getDt() != null ? movDtoRequest.getDt() : LocalDateTime.now();
        dtTo = dtTo.with(LocalTime.MAX);

        Pageable pageable = PageRequest.of(0, 20);

        List<TransferMovementEntityView> lst = transferMovementRepository.listLatestTransfersByDtLessThanEqual(dtTo, pageable);

        SearchResponseDto<TransferMovementDto> response = new SearchResponseDto<>();
        response.setList(transferMovementAdapter.toDto(lst));
        response.setPageNumber(1);
        response.setPageSize(20);
        response.setTotalElements(20);
        response.setTotalPages(1);

        return response;
    }


    public TransferMovementDto transferInsert(TransferMovementDto dto) {

        if( dto == null ) {
            throw new PfUnexpectedException(400, "01", "Valore in inserimento nullo");
        }

        if( dto.getId() != null
            || dto.getIdTo() != null
            || dto.getIdFrom() != null ) {
            throw new PfUnexpectedException(400, "02", "Valore in inserimento gia' presente per l'identificativo");
        }

        LocalDateTime now = LocalDateTime.now();
        Long blockId = System.currentTimeMillis();
        LocalDateTime dt = dto.getDt() != null ? dto.getDt() : LocalDateTime.now();
        EconomicAccountEntity economicAccount = null;

        // popolo 2 movimenti
        // positive
        MovementEntity movTo = new MovementEntity();
            movTo.setCreatedAt(now);
            movTo.setUpdatedAt(now);
            movTo.setBlockId( blockId );
            movTo.setDt( dt );
            movTo.setEconomicAccount( economicAccount );
            movTo.setNote( dto.getNote());
            movTo.setAmount( dto.getAmount() );
            movTo.setPatrimonialFund( patrimonialFundAdapter.toEntity(dto.getPatrimonialFundTo()) );

        // negative
        MovementEntity movFrom = new MovementEntity();
            movFrom.setCreatedAt(now);
            movFrom.setUpdatedAt(now);
            movFrom.setBlockId( blockId );
            movFrom.setDt( dt );
            movFrom.setEconomicAccount( economicAccount );
            movFrom.setNote( dto.getNote());
            movFrom.setAmount( dto.getAmount().multiply(BigDecimal.valueOf(-1)) );
            movFrom.setPatrimonialFund( patrimonialFundAdapter.toEntity(dto.getPatrimonialFundFrom()) );

        if( !checkInsertFields(movTo) || !checkInsertFields(movFrom) ) {
            throw new PfUnexpectedException(400, "04", "Valore in inserimento non valido");
        }

        List<MovementEntity> movementEntities = repository.saveAll(List.of(movFrom, movTo));

        return transferMovementAdapter.toDtoFromMovementList(movementEntities);

    }

    public TransferMovementDto transferEdit(TransferMovementDto dto) {

        if( dto == null ) {
            throw new PfUnexpectedException(400, "05", "Valore in modifica nullo");
        }

        MovementEntity eTo = dto.getIdTo() != null ? repository.findById(dto.getIdTo()).orElse(null) : null;
        MovementEntity eFrom = dto.getIdFrom() != null ? repository.findById(dto.getIdFrom()).orElse(null) : null;
        if( eTo == null || eFrom == null ) {
            throw new PfUnexpectedException(400, "06", "Valore in modifica non presente per l'identificativo");
        }

        transferMovementAdapter.evaluateForEdit(eTo, eFrom, dto);

        if( !checkEditFields(eTo) || !checkEditFields(eFrom) ) {
            throw new PfUnexpectedException(400, "08", "Valore in modifica non valido");
        }

        List<MovementEntity> movementEntities = repository.saveAll(List.of(eFrom, eTo));

        return transferMovementAdapter.toDtoFromMovementList(movementEntities);

    }

    public void transferDelete(Long blockId) {
        repository.findAllByBlockId(blockId).forEach(movement -> {
                    repository.deleteById(movement.getId());
                });
    }

}
