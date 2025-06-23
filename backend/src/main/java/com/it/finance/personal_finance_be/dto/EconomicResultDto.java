package com.it.finance.personal_finance_be.dto;

import java.math.BigDecimal;

public class EconomicResultDto {

    public EconomicResultDto(){}

    public EconomicResultDto(BigDecimal totalRevenues, BigDecimal totalCosts){
        this.totalRevenues = totalRevenues;
        this.totalCosts = totalCosts;
        this.totalResult = totalRevenues.subtract(totalCosts);
    }

    private BigDecimal totalRevenues=BigDecimal.ZERO;

    private BigDecimal totalCosts=BigDecimal.ZERO;

    private BigDecimal totalResult=BigDecimal.ZERO;

    public BigDecimal getTotalRevenues() {
        return totalRevenues;
    }

    public void setTotalRevenues(BigDecimal totalRevenues) {
        this.totalRevenues = totalRevenues;
    }

    public BigDecimal getTotalCosts() {
        return totalCosts;
    }

    public void setTotalCosts(BigDecimal totalCosts) {
        this.totalCosts = totalCosts;
    }

    public BigDecimal getTotalResult() {
        return totalResult;
    }

    public void setTotalResult(BigDecimal totalResult) {
        this.totalResult = totalResult;
    }
}
