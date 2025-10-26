package com.it.finance.personal_finance_be.service;

import com.it.finance.personal_finance_be.adapter.PatrimonialFundAdapter;
import com.it.finance.personal_finance_be.dao.MovementJpaRepo;
import com.it.finance.personal_finance_be.dao.PatrimonialFundJpaRepo;
import com.it.finance.personal_finance_be.dao.view.VEconomicResultDetailJpaRepo;
import com.it.finance.personal_finance_be.dao.view.VEconomicResultJpaRepo;
import com.it.finance.personal_finance_be.dto.EconomicResultDto;
import com.it.finance.personal_finance_be.dto.PatrimonialResultDto;
import com.it.finance.personal_finance_be.dto.view.VEconomicResultDetailDto;
import com.it.finance.personal_finance_be.dto.view.VEconomicResultDto;
import com.it.finance.personal_finance_be.entity.PatrimonialFundEntity;
import com.it.finance.personal_finance_be.entity.data.PatrimonialFundSumModel;
import com.it.finance.personal_finance_be.entity.view.VEconomicResultDetailEntity;
import com.it.finance.personal_finance_be.entity.view.VEconomicResultEntity;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class ReportService {

    @Autowired
    private MovementJpaRepo repository;

    @Autowired
    private PatrimonialFundJpaRepo patrimonialFundRepository;

    @Autowired
    private PatrimonialFundAdapter adapter;

    @Autowired
    private VEconomicResultJpaRepo vEconomicResultJpaRepo;

    @Autowired
    private VEconomicResultDetailJpaRepo vEconomicResultDetailJpaRepo;

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

    public Set<Integer> listYearsWithTransactions() {
        List<Integer> lst = repository.listYearsWithTransactions();
        lst.add( LocalDateTime.now().getYear() );
        return Set.copyOf(lst);
    }

    public List<VEconomicResultDto> findEconomicResultByYear(Integer year, Integer month) {

        VEconomicResultEntity e = new VEconomicResultEntity();
        e.setYear(year);
        e.setMonthIndex(month != null ? month.toString() : null);
        ExampleMatcher em = e.generateExample();
        Example<VEconomicResultEntity> example = Example.of(e, em);

        List<VEconomicResultEntity> listEntities = vEconomicResultJpaRepo.findAll(example);
        List<VEconomicResultDto> listDtos = new ArrayList<>();
        for( VEconomicResultEntity entity : listEntities ) {
            VEconomicResultDto dto = new VEconomicResultDto();
            BeanUtils.copyProperties(entity, dto);
            listDtos.add(dto);
        }

        return listDtos;

    }

    public List<VEconomicResultDetailDto> findEconomicResultDetail(Integer year) {

        VEconomicResultDetailEntity e = new VEconomicResultDetailEntity();
        e.setYear(year);
        ExampleMatcher em = e.generateExample();
        Example<VEconomicResultDetailEntity> example = Example.of(e, em);

        List<VEconomicResultDetailEntity> listEntities = vEconomicResultDetailJpaRepo.findAll(example);
        List<VEconomicResultDetailDto> listDtos = new ArrayList<>();
        for( VEconomicResultDetailEntity entity : listEntities ) {
            VEconomicResultDetailDto dto = new VEconomicResultDetailDto();
            BeanUtils.copyProperties(entity, dto);
            listDtos.add(dto);
        }

        return listDtos;

    }

}
