package com.it.finance.personal_finance_be.dao;

import com.it.finance.personal_finance_be.dto.PatrimonialResultDto;
import com.it.finance.personal_finance_be.entity.MovementEntity;
import com.it.finance.personal_finance_be.entity.TransferMovementEntityView;
import com.it.finance.personal_finance_be.entity.data.PatrimonialFundSumModel;
import com.it.finance.personal_finance_be.framework.PfRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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

    List<MovementEntity> findAllByBlockId(Long blockId);

    @Query("SELECT SUM(m.amount) " +
            " FROM MovementEntity m " +
            " WHERE m.economicAccount.economicCategory.nature = :nature " +
            " AND m.dt >= :from " +
            " AND m.dt < :to")
    BigDecimal sumEconomicAccountsInRangeDate(LocalDateTime from, LocalDateTime to, String nature);

    @Query("SELECT new com.it.finance.personal_finance_be.entity.data.PatrimonialFundSumModel" +
            " ( m.patrimonialFund, SUM(m.amount) ) " +
            " FROM MovementEntity m " +
            " WHERE m.dt <= :dtRef " +
            " AND m.patrimonialFund IS NOT NULL " +
            " GROUP BY m.patrimonialFund ")
    List<PatrimonialFundSumModel> sumPatrimonialFundsUntilDate(LocalDateTime dtRef);



}
