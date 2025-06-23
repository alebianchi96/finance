package com.it.finance.personal_finance_be.entity.data;

import com.it.finance.personal_finance_be.entity.PatrimonialFundEntity;

import java.math.BigDecimal;

public class PatrimonialFundSumModel {

    public static final String SN = PatrimonialFundSumModel.class.getSimpleName();

    private PatrimonialFundEntity patrimonialFund;

    private BigDecimal amount;

    public PatrimonialFundSumModel(){}

    public PatrimonialFundSumModel(PatrimonialFundEntity patrimonialFund, BigDecimal amount) {
        this.patrimonialFund = patrimonialFund;
        this.amount = amount;
    }

    public PatrimonialFundEntity getPatrimonialFund() {
        return patrimonialFund;
    }

    public void setPatrimonialFund(PatrimonialFundEntity patrimonialFund) {
        this.patrimonialFund = patrimonialFund;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
