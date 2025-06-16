package com.it.finance.personal_finance_be.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "v_transfer_movements")
@Immutable
public class TransferMovementEntityView {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "dt")
    private LocalDateTime dt;

    @Column(name = "note")
    private String note;

    @Column(name = "id_to")
    private Long idTo;

    @ManyToOne
    @JoinColumn(name = "fk_patrimonial_fund_to", referencedColumnName = "id")
    private PatrimonialFundEntity patrimonialFundTo;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "id_from")
    private Long idFrom;

    @ManyToOne
    @JoinColumn(name = "fk_patrimonial_fund_from", referencedColumnName = "id")
    private PatrimonialFundEntity patrimonialFundFrom;

    public Long getIdTo() {
        return idTo;
    }

    public void setIdTo(Long idTo) {
        this.idTo = idTo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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

    public PatrimonialFundEntity getPatrimonialFundTo() {
        return patrimonialFundTo;
    }

    public void setPatrimonialFundTo(PatrimonialFundEntity patrimonialFundTo) {
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

    public PatrimonialFundEntity getPatrimonialFundFrom() {
        return patrimonialFundFrom;
    }

    public void setPatrimonialFundFrom(PatrimonialFundEntity patrimonialFundFrom) {
        this.patrimonialFundFrom = patrimonialFundFrom;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
