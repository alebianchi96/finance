package com.it.finance.personal_finance_be.dao;

import com.it.finance.personal_finance_be.entity.MovementEntity;
import com.it.finance.personal_finance_be.framework.PfRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface MovementJpaRepo extends PfRepository<MovementEntity> {

    long countByEconomicAccountId(Long idEconomicAccount);

    long countByPatrimonialFundId(Long idPatrimonialFund);

    boolean existsByBlockIdAndIdNot(Long blockId, Long id);

    @Query("SELECT m FROM MovementEntity m " +
            " WHERE m.patrimonialFund.id = :idPatrimonialFund " +
            " AND m.dt <= :dtTo " +
            " AND m.economicAccount IS NOT NULL " +
            " ORDER BY m.dt DESC")
    List<MovementEntity> listLatestEconomicsByPatrimonialFundAndDtLessThanEqual(Long idPatrimonialFund, LocalDateTime dtTo, Pageable pageable);

    @Query("SELECT m FROM MovementEntity m " +
            " WHERE m.patrimonialFund.id = :idPatrimonialFund " +
            " AND m.dt <= :dtTo " +
            " AND m.economicAccount IS NULL " +
            " ORDER BY m.dt DESC")
    List<MovementEntity> listLatestTransfersByPatrimonialFundAndDtLessThanEqual(Long idPatrimonialFund, LocalDateTime dtTo, Pageable pageable);

}
