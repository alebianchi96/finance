package com.it.finance.personal_finance_be.entity.view;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;
import org.springframework.data.domain.ExampleMatcher;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Immutable
@Table(name = "V_ECONOMIC_RESULTS_DETAIL")
@IdClass(VEconomicResultDetailEntity.VEconomicResultDetailPK.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class VEconomicResultDetailEntity {

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "ys", nullable = false)
    private Integer year;

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "categoria", nullable = false)
    private String economicCategory;

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "conto")
    private String economicAccount;

    @Column(name = "gen", precision = 19, scale = 2)
    private BigDecimal gen;

    @Column(name = "feb", precision = 19, scale = 2)
    private BigDecimal feb;

    @Column(name = "mar", precision = 19, scale = 2)
    private BigDecimal mar;

    @Column(name = "apr", precision = 19, scale = 2)
    private BigDecimal apr;

    @Column(name = "mag", precision = 19, scale = 2)
    private BigDecimal mag;

    @Column(name = "giu", precision = 19, scale = 2)
    private BigDecimal giu;

    @Column(name = "lug", precision = 19, scale = 2)
    private BigDecimal lug;

    @Column(name = "ago", precision = 19, scale = 2)
    private BigDecimal ago;

    @Column(name = "sett", precision = 19, scale = 2)
    private BigDecimal sett;

    @Column(name = "ott", precision = 19, scale = 2)
    private BigDecimal ott;

    @Column(name = "nov", precision = 19, scale = 2)
    private BigDecimal nov;

    @Column(name = "dic", precision = 19, scale = 2)
    private BigDecimal dic;

    @Column(name = "total_for_year", precision = 19, scale = 2)
    private BigDecimal totalForYear;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VEconomicResultDetailPK implements Serializable {
        private Integer year;
        private String economicCategory;
        private String economicAccount;
    }

    public ExampleMatcher generateExample() {
        return ExampleMatcher.matchingAll()
                .withMatcher("year", ExampleMatcher.GenericPropertyMatchers.exact());
    }

}
