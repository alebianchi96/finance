package com.it.finance.personal_finance_be.service;

import com.it.finance.personal_finance_be.adapter.EconomicAccountAdapter;
import com.it.finance.personal_finance_be.dao.EconomicAccountJpaRepo;
import com.it.finance.personal_finance_be.dao.MovementJpaRepo;
import com.it.finance.personal_finance_be.dto.EconomicAccountDto;
import com.it.finance.personal_finance_be.entity.EconomicAccountEntity;
import com.it.finance.personal_finance_be.framework.IPfAdapter;
import com.it.finance.personal_finance_be.framework.PfRepository;
import com.it.finance.personal_finance_be.framework.PfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EconomicAccountService extends PfService<EconomicAccountEntity, EconomicAccountDto> {

    @Autowired
    private EconomicAccountJpaRepo repository;

    @Autowired
    private MovementJpaRepo movementRepository;

    @Autowired
    private EconomicAccountAdapter adapter;


    @Override
    protected PfRepository<EconomicAccountEntity> getRepository() {
        return repository;
    }

    @Override
    protected IPfAdapter<EconomicAccountEntity, EconomicAccountDto> getAdapter() {
        return adapter;
    }

    @Override
    public boolean existItem(EconomicAccountEntity entity) {
        return repository.existsByCode(entity.getCode());
    }

    @Override
    public boolean checkInsertFields(EconomicAccountEntity entity) {
        if( !StringUtils.hasText(entity.getCode())
                || !StringUtils.hasText(entity.getLabel())
                || entity.getEconomicCategory() == null
                || entity.getEconomicCategory().getId() == null )
        {
            return false;
        }
        return true;
    }

    @Override
    public boolean checkEditFields(EconomicAccountEntity entity) {
        if( !StringUtils.hasText(entity.getCode())
                || !StringUtils.hasText(entity.getLabel())
                || entity.getEconomicCategory() == null
                || entity.getEconomicCategory().getId() == null )
        {
            return false;
        }
        return true;
    }

    @Override
    public boolean checkDeleteCondition(EconomicAccountEntity entity) {
        // exists accounts with this account
        long numberOfLinkedEntities = movementRepository
                .countByEconomicAccountId(entity.getId());
        return numberOfLinkedEntities == 0;
    }

}
