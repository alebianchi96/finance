package com.it.finance.personal_finance_be.service;

import com.it.finance.personal_finance_be.adapter.MovementAdapter;
import com.it.finance.personal_finance_be.dao.MovementJpaRepo;
import com.it.finance.personal_finance_be.dto.MovementDto;
import com.it.finance.personal_finance_be.entity.MovementEntity;
import com.it.finance.personal_finance_be.framework.IPfAdapter;
import com.it.finance.personal_finance_be.framework.PfRepository;
import com.it.finance.personal_finance_be.framework.PfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
