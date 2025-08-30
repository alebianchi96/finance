package com.it.finance.personal_finance_be.dao;

import com.it.finance.personal_finance_be.entity.TransferMovementEntityView;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TransferMovementJpaRepo extends JpaRepository<TransferMovementEntityView, Long> {

    @Query("SELECT m FROM TransferMovementEntityView m " +
            " WHERE m.dt <= :dtTo " +
            " ORDER BY m.dt DESC, m.createdAt DESC ")
    List<TransferMovementEntityView> listLatestTransfersByDtLessThanEqual(LocalDateTime dtTo, Pageable pageable);

}
