package com.it.finance.personal_finance_be.dao;

import com.it.finance.personal_finance_be.entity.EconomicAccountEntity;
import com.it.finance.personal_finance_be.framework.PfRepository;

public interface EconomicAccountJpaRepo extends PfRepository<EconomicAccountEntity> {

    long countByEconomicCategoryId(Long idEconomicCategoryId);

    boolean existsByCode(String code);

    boolean existsByCodeAndEconomicCategoryId(String code, EconomicAccountEntity entity);

}
