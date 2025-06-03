package com.it.finance.personal_finance_be.dao;

import com.it.finance.personal_finance_be.entity.PatrimonialFundEntity;
import com.it.finance.personal_finance_be.framework.PfRepository;

public interface PatrimonialFundJpaRepo extends PfRepository<PatrimonialFundEntity> {

    boolean existsByCode(String code);

}
