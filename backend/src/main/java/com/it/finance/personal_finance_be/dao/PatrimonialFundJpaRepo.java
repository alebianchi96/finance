package com.it.finance.personal_finance_be.dao;

import com.it.finance.personal_finance_be.entity.PatrimonialFundEntity;
import com.it.finance.personal_finance_be.framework.PfRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PatrimonialFundJpaRepo extends PfRepository<PatrimonialFundEntity> {

    boolean existsByCode(String code);

    @Query("SELECT SUM(m.amount) FROM MovementEntity m " +
            " WHERE m.patrimonialFund.id = :idPatrimonialFund " +
            " AND m.dt <= :dtTo ")
    BigDecimal sumAmountByIdAndDtLessThanEqual(Long idPatrimonialFund, LocalDateTime dtTo);

}
