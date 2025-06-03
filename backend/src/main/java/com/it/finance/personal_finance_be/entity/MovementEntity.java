package com.it.finance.personal_finance_be.entity;

import com.it.finance.personal_finance_be.framework.PfEntity;
import jakarta.persistence.*;
import org.springframework.data.domain.ExampleMatcher;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movements")
public class MovementEntity extends PfEntity {

    @Column(name = "dt")
    private LocalDateTime dt;

    @ManyToOne
    @JoinColumn(name = "fk_economic_account", referencedColumnName = "id")
    private EconomicAccountEntity economicAccount;

    @Column(name = "note")
    private String note;

    @ManyToOne
    @JoinColumn(name = "fk_patrimonial_fund", referencedColumnName = "id")
    private PatrimonialFundEntity patrimonialFund;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "block_id")
    // evaluated if it is a transfer to link both movements
    // current timestamp as number
    private Long blockId;


    @Override
    public ExampleMatcher generateExample() {
        return ExampleMatcher.matchingAll()
                .withMatcher("id", ExampleMatcher.GenericPropertyMatchers.exact())
                .withMatcher("blockId", ExampleMatcher.GenericPropertyMatchers.exact())
                .withMatcher("patrimonialFund.id", ExampleMatcher.GenericPropertyMatchers.exact())
                .withMatcher("patrimonialFund.label", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("patrimonialFund.code", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("economicAccount.id", ExampleMatcher.GenericPropertyMatchers.exact())
                .withMatcher("economicAccount.label", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("economicAccount.code", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("economicAccount.economicCategory.id", ExampleMatcher.GenericPropertyMatchers.exact())
                .withMatcher("economicAccount.economicCategory.label", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("economicAccount.economicCategory.code", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("economicAccount.economicCategory.nature", ExampleMatcher.GenericPropertyMatchers.exact());
    }

    public LocalDateTime getDt() {
        return dt;
    }

    public void setDt(LocalDateTime dt) {
        this.dt = dt;
    }

    public EconomicAccountEntity getEconomicAccount() {
        return economicAccount;
    }

    public void setEconomicAccount(EconomicAccountEntity economicAccount) {
        this.economicAccount = economicAccount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
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

    public Long getBlockId() {
        return blockId;
    }

    public void setBlockId(Long blockId) {
        this.blockId = blockId;
    }
}
