package com.it.finance.personal_finance_be.entity.view;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import org.springframework.data.domain.ExampleMatcher;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Immutable
@Table(name = "V_ECONOMIC_RESULTS")
@IdClass(VEconomicResultEntity.VEconomicResultPK.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class VEconomicResultEntity {

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "ys", nullable = false)
    private Integer year;

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "mm", nullable = false)
    private String monthIndex; // from 1 to 12 as String

    @Column(name = "totale_ricavi", precision = 19, scale = 2)
    private BigDecimal totaleRicavi;

    @Column(name = "totale_costi", precision = 19, scale = 2)
    private BigDecimal totaleCosti;

    @Column(name = "totale", precision = 19, scale = 2)
    private BigDecimal totale;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VEconomicResultPK implements Serializable {
        private Integer year;
        private String monthIndex; // from 1 to 12 as String
    }

    public ExampleMatcher generateExample() {
        return ExampleMatcher.matchingAll()
                .withMatcher("year", ExampleMatcher.GenericPropertyMatchers.exact())
                .withMatcher("month", ExampleMatcher.GenericPropertyMatchers.exact());
    }

}
