package com.it.finance.personal_finance_be.service;

import com.it.finance.personal_finance_be.adapter.EconomicCategoryAdapter;
import com.it.finance.personal_finance_be.dao.EconomicAccountJpaRepo;
import com.it.finance.personal_finance_be.dao.EconomicCategoryJpaRepo;
import com.it.finance.personal_finance_be.dto.EconomicCategoryDto;
import com.it.finance.personal_finance_be.entity.EconomicCategoryEntity;
import com.it.finance.personal_finance_be.framework.IPfAdapter;
import com.it.finance.personal_finance_be.framework.PfRepository;
import com.it.finance.personal_finance_be.framework.PfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EconomicCategoryService extends PfService<EconomicCategoryEntity, EconomicCategoryDto> {

    @Autowired
    private EconomicCategoryJpaRepo repository;

    @Autowired
    private EconomicAccountJpaRepo economicAccountRepository;

    @Autowired
    private EconomicCategoryAdapter adapter;

    @Override
    protected PfRepository<EconomicCategoryEntity> getRepository() {
        return repository;
    }

    @Override
    protected IPfAdapter<EconomicCategoryEntity, EconomicCategoryDto> getAdapter() {
        return adapter;
    }

    @Override
    public boolean existItem(EconomicCategoryEntity entity) {
        // by label or code and nature
        return repository.existsByCode(entity.getCode());
    }

    @Override
    public boolean checkInsertFields(EconomicCategoryEntity entity) {
        if( !StringUtils.hasText(entity.getCode())
                || !StringUtils.hasText(entity.getLabel())
                || !StringUtils.hasText(entity.getNature()) )
        {
            return false;
        }
        return true;
    }

    @Override
    public boolean checkEditFields(EconomicCategoryEntity entity) {
        if( !StringUtils.hasText(entity.getCode())
                || !StringUtils.hasText(entity.getLabel())
                || !StringUtils.hasText(entity.getNature()) )
        {
            return false;
        }
        return true;
    }

    @Override
    public boolean checkDeleteCondition(EconomicCategoryEntity entity) {
        // exists accounts with this category
        long numberOfLinkedEntities = economicAccountRepository
                .countByEconomicCategoryId(entity.getId());
        return numberOfLinkedEntities == 0;
    }

}
