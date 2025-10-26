package com.it.finance.personal_finance_be.entity;

import com.it.finance.personal_finance_be.framework.PfTypoEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.domain.ExampleMatcher;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "economic_categories")
@Data
public class EconomicCategoryEntity extends PfTypoEntity {

    @Column
    private String nature;

    @Column
    private Integer ordering;

    @Override
    public ExampleMatcher generateExample() {
        return ExampleMatcher.matchingAll()
                .withMatcher("id", ExampleMatcher.GenericPropertyMatchers.exact())
                .withMatcher("label", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("code", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("nature", ExampleMatcher.GenericPropertyMatchers.exact());
    }

}
