package com.it.finance.personal_finance_be.dao.view;

import com.it.finance.personal_finance_be.entity.view.VEconomicResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VEconomicResultJpaRepo
        extends JpaRepository<VEconomicResultEntity, VEconomicResultEntity.VEconomicResultPK> {
}
