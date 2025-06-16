package com.it.finance.personal_finance_be.dto;

import com.it.finance.personal_finance_be.framework.PfDto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransferMovementDto extends PfDto {

    private LocalDateTime dt;

    private String note;

    private Long idTo;

    private PatrimonialFundDto patrimonialFundTo;

    private BigDecimal amount;

    private Long idFrom;

    private PatrimonialFundDto patrimonialFundFrom;

    public Long getIdTo() {
        return idTo;
    }

    public void setIdTo(Long idTo) {
        this.idTo = idTo;
    }

    public LocalDateTime getDt() {
        return dt;
    }

    public void setDt(LocalDateTime dt) {
        this.dt = dt;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public PatrimonialFundDto getPatrimonialFundTo() {
        return patrimonialFundTo;
    }

    public void setPatrimonialFundTo(PatrimonialFundDto patrimonialFundTo) {
        this.patrimonialFundTo = patrimonialFundTo;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getIdFrom() {
        return idFrom;
    }

    public void setIdFrom(Long idFrom) {
        this.idFrom = idFrom;
    }

    public PatrimonialFundDto getPatrimonialFundFrom() {
        return patrimonialFundFrom;
    }

    public void setPatrimonialFundFrom(PatrimonialFundDto patrimonialFundFrom) {
        this.patrimonialFundFrom = patrimonialFundFrom;
    }
}
