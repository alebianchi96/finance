package com.it.finance.personal_finance_be.entity;

import com.it.finance.personal_finance_be.framework.PfTypoEntity;
import jakarta.persistence.*;
import org.springframework.data.domain.ExampleMatcher;

@Entity
@Table(name = "economic_accounts")
public class EconomicAccountEntity extends PfTypoEntity {

    @ManyToOne
    @JoinColumn(name = "fk_economic_category", referencedColumnName = "id")
    private EconomicCategoryEntity economicCategory;

    @Override
    public ExampleMatcher generateExample() {
        return ExampleMatcher.matchingAll()
                .withMatcher("id", ExampleMatcher.GenericPropertyMatchers.exact())
                .withMatcher("label", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("code", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("economicCategory.id", ExampleMatcher.GenericPropertyMatchers.exact())
                .withMatcher("economicCategory.label", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("economicCategory.code", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("economicCategory.nature", ExampleMatcher.GenericPropertyMatchers.exact());
    }

    public EconomicCategoryEntity getEconomicCategory() {
        return economicCategory;
    }

    public void setEconomicCategory(EconomicCategoryEntity economicCategory) {
        this.economicCategory = economicCategory;
    }
}
