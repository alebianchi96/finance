package com.it.finance.personal_finance_be.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PatrimonialResultDto {

    public PatrimonialResultDto() {}

    public PatrimonialResultDto(List<PatrimonialResultItem> listItems) {
        this.listItems = listItems;
        for(PatrimonialResultItem i : this.listItems) {
            this.totalAmount = this.totalAmount.add(i.getAmount());
        }
    }

    private BigDecimal totalAmount = BigDecimal.ZERO;

    private List<PatrimonialResultItem> listItems = new ArrayList<>();

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<PatrimonialResultItem> getListItems() {
        return listItems;
    }

    public void setListItems(List<PatrimonialResultItem> listItems) {
        this.listItems = listItems;
    }

    public static class PatrimonialResultItem {

        private PatrimonialFundDto patrimonialFund;

        private BigDecimal amount = BigDecimal.ZERO;

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
    }


}
