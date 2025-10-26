package com.it.finance.personal_finance_be.controller;

import com.it.finance.personal_finance_be.dto.EconomicResultDto;
import com.it.finance.personal_finance_be.dto.MovementDto;
import com.it.finance.personal_finance_be.dto.PatrimonialResultDto;
import com.it.finance.personal_finance_be.dto.TransferMovementDto;
import com.it.finance.personal_finance_be.dto.view.VEconomicResultDetailDto;
import com.it.finance.personal_finance_be.dto.view.VEconomicResultDto;
import com.it.finance.personal_finance_be.entity.MovementEntity;
import com.it.finance.personal_finance_be.framework.*;
import com.it.finance.personal_finance_be.framework.utilities.DateUtils;
import com.it.finance.personal_finance_be.service.MovementService;
import com.it.finance.personal_finance_be.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/report")
@CrossOrigin("*")
public class ReportController {

    @Autowired
    private ReportService service;


    @GetMapping("/years")
    public List<Integer> listYearsWithTransactions() {
        Set<Integer> hsYearsWithTransactions = service.listYearsWithTransactions();
        return hsYearsWithTransactions.stream()
                .sorted(java.util.Comparator.reverseOrder())
                .toList();
    }


    // risultato economico nel periodo indicato
    // totale entrate
    // totale uscite
    // risultato economico = entrate - uscite
    @GetMapping("/economic/from/{dtFromAsLong}/to/{dtToAsLong}")
    public ResponseEntity<PfObjectApiResponse<EconomicResultDto>> getEconomicResult(
            @PathVariable Long dtFromAsLong,
            @PathVariable Long dtToAsLong) {
        try {

            LocalDateTime from = DateUtils.toLocalDateTime(dtFromAsLong);
            from = from.withHour(0).withMinute(0).withSecond(0).withNano(0);

            LocalDateTime to = DateUtils.toLocalDateTime(dtToAsLong);
            to = to.plusDays(1);
            to = to.withHour(0).withMinute(0).withSecond(0).withNano(0);

            EconomicResultDto resultDto = service.getEconomicResult(from, to);
            return ResponseEntity.ok(PfObjectApiResponse.ok(resultDto));
        } catch (PfUnexpectedException e) {
            return ResponseEntity.ok(PfObjectApiResponse.ko(
                    e.getCode(), e.getInternalCode(), e.getMessage()
            ));
        }
    }

    // risultato patrimoniale
    // somma algebrica fino alla mezzanotte del giorno indicato
    @GetMapping("/patrimonial/date/{dateRefAsLong}")
    public ResponseEntity<PfObjectApiResponse<PatrimonialResultDto>> getPatrimonialResult(
            @PathVariable Long dateRefAsLong) {
        try {

            LocalDateTime dtRef = DateUtils.toLocalDateTime(dateRefAsLong);
            dtRef = dtRef.plusDays(1);
            dtRef = dtRef.withHour(0).withMinute(0).withSecond(0).withNano(0);

            PatrimonialResultDto resultDto = service.getPatrimonialResult(dtRef);
            return ResponseEntity.ok(PfObjectApiResponse.ok(resultDto));
        } catch (PfUnexpectedException e) {
            return ResponseEntity.ok(PfObjectApiResponse.ko(
                    e.getCode(), e.getInternalCode(), e.getMessage()
            ));
        }
    }


    @GetMapping("/economic/result/year/{year}")
    public ResponseEntity<List<VEconomicResultDto>> findEconomicResultByYear(
            @PathVariable Integer year) {
        return ResponseEntity.ok( service.findEconomicResultByYear(year, null) );
    }

    @GetMapping("/economic/result/year/{year}/month/{month}")
    public ResponseEntity<List<VEconomicResultDto>> findEconomicResultByYearMonth(
            @PathVariable Integer year, @PathVariable Integer month) {
        return ResponseEntity.ok( service.findEconomicResultByYear(year, month) );
    }

    @GetMapping("/economic/result/detail/year/{year}")
    public ResponseEntity<List<VEconomicResultDetailDto>> findEconomicResultDetail(
            @PathVariable Integer year) {
        return ResponseEntity.ok( service.findEconomicResultDetail(year) );
    }


}
