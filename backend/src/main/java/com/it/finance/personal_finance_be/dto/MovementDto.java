package com.it.finance.personal_finance_be.dto;

import com.it.finance.personal_finance_be.framework.PfDto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MovementDto extends PfDto {

    private LocalDateTime dt;

    private EconomicAccountDto economicAccount;

    private String note;

    private PatrimonialFundDto patrimonialFund;

    private BigDecimal amount;

    private Long blockId;

    public LocalDateTime getDt() {
        return dt;
    }

    public void setDt(LocalDateTime dt) {
        this.dt = dt;
    }

    public EconomicAccountDto getEconomicAccount() {
        return economicAccount;
    }

    public void setEconomicAccount(EconomicAccountDto economicAccount) {
        this.economicAccount = economicAccount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public PatrimonialFundDto getPatrimonialFund() {
        return patrimonialFund;
    }

    public void setPatrimonialFund(PatrimonialFundDto patrimonialFund) {
        this.patrimonialFund = patrimonialFund;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getBlockId() {
        return blockId;
    }

    public void setBlockId(Long blockId) {
        this.blockId = blockId;
    }
}
