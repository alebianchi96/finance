package com.it.finance.personal_finance_be.dao;

import com.it.finance.personal_finance_be.entity.MovementEntity;
import com.it.finance.personal_finance_be.framework.PfRepository;

public interface MovementJpaRepo extends PfRepository<MovementEntity> {

    long countByEconomicAccountId(Long idEconomicAccount);

    long countByPatrimonialFundId(Long idPatrimonialFund);

    boolean existsByBlockIdAndIdNot(Long blockId, Long id);
}
