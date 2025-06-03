package com.it.finance.personal_finance_be.framework;

import org.springframework.data.domain.ExampleMatcher;

public interface IPfEntity {

    public ExampleMatcher generateExample();

}
