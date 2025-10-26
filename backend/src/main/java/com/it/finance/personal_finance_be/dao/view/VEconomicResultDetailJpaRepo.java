package com.it.finance.personal_finance_be.dao.view;

import com.it.finance.personal_finance_be.entity.view.VEconomicResultDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VEconomicResultDetailJpaRepo
        extends JpaRepository<VEconomicResultDetailEntity, VEconomicResultDetailEntity.VEconomicResultDetailPK> {
}
