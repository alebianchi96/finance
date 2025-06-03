package com.it.finance.personal_finance_be.entity;

import com.it.finance.personal_finance_be.framework.PfTypoEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.springframework.data.domain.ExampleMatcher;

@Entity
@Table(name = "patrimonial_funds")
public class PatrimonialFundEntity extends PfTypoEntity {

    @Override
    public ExampleMatcher generateExample() {
        return ExampleMatcher.matchingAll()
                .withMatcher("id", ExampleMatcher.GenericPropertyMatchers.exact())
                .withMatcher("label", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                .withMatcher("code", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                ;
    }
    
}
