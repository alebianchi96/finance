package com.it.finance.personal_finance_be.service;

import com.it.finance.personal_finance_be.adapter.PatrimonialFundAdapter;
import com.it.finance.personal_finance_be.dao.MovementJpaRepo;
import com.it.finance.personal_finance_be.dao.PatrimonialFundJpaRepo;
import com.it.finance.personal_finance_be.dto.EconomicResultDto;
import com.it.finance.personal_finance_be.dto.PatrimonialResultDto;
import com.it.finance.personal_finance_be.entity.PatrimonialFundEntity;
import com.it.finance.personal_finance_be.entity.data.PatrimonialFundSumModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private MovementJpaRepo repository;

    @Autowired
    private PatrimonialFundJpaRepo patrimonialFundRepository;

    @Autowired
    private PatrimonialFundAdapter adapter;

    public EconomicResultDto getEconomicResult(LocalDateTime from, LocalDateTime to) {
        BigDecimal totalRevenues = repository.sumEconomicAccountsInRangeDate(from, to, "R");
        if( totalRevenues==null ) {
            totalRevenues = BigDecimal.ZERO;
        }
        if( totalRevenues.compareTo(BigDecimal.ZERO) < 0 ) {
            totalRevenues = totalRevenues.multiply(BigDecimal.valueOf(-1));
        }
        BigDecimal totalCosts = repository.sumEconomicAccountsInRangeDate(from, to, "C");
        if( totalCosts==null ) {
            totalCosts = BigDecimal.ZERO;
        }
        if( totalCosts.compareTo(BigDecimal.ZERO) < 0 ) {
            totalCosts = totalCosts.multiply(BigDecimal.valueOf(-1));
        }
        return new EconomicResultDto(totalRevenues, totalCosts);
    }

    public PatrimonialResultDto getPatrimonialResult(LocalDateTime dtRef) {

        List<PatrimonialFundSumModel> listSums = repository.sumPatrimonialFundsUntilDate(dtRef);

        List<PatrimonialResultDto.PatrimonialResultItem> listItems = new ArrayList<>();
        for( PatrimonialFundSumModel e : listSums ) {
            PatrimonialResultDto.PatrimonialResultItem item = new PatrimonialResultDto.PatrimonialResultItem();
            item.setPatrimonialFund(adapter.toDto(e.getPatrimonialFund()));
            item.setAmount(e.getAmount());
            listItems.add(item);
        }

        return new PatrimonialResultDto(listItems);
    }

}
