package com.it.finance.personal_finance_be.dto.view;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class VEconomicResultDto implements Serializable {

    private Integer year;

    private String monthIndex; // from 1 to 12 as String

    private BigDecimal totaleRicavi;

    private BigDecimal totaleCosti;

    private BigDecimal totale;

}
