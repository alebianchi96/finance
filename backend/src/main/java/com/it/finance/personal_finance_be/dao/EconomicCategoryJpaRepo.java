package com.it.finance.personal_finance_be.dao;

import com.it.finance.personal_finance_be.entity.EconomicCategoryEntity;
import com.it.finance.personal_finance_be.framework.PfRepository;

public interface EconomicCategoryJpaRepo extends PfRepository<EconomicCategoryEntity> {

    boolean existsByCode(String code);

    boolean existsByCodeAndNature(String code, String nature);

}
