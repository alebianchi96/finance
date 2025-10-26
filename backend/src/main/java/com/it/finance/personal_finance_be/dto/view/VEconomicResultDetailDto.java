package com.it.finance.personal_finance_be.dto.view;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class VEconomicResultDetailDto implements Serializable {

    private Integer year;

    private String economicCategory;

    private String economicAccount;

    private BigDecimal gen;

    private BigDecimal feb;

    private BigDecimal mar;

    private BigDecimal apr;

    private BigDecimal mag;

    private BigDecimal giu;

    private BigDecimal lug;

    private BigDecimal ago;

    private BigDecimal sett;

    private BigDecimal ott;

    private BigDecimal nov;

    private BigDecimal dic;

    private BigDecimal totalForYear;

}
