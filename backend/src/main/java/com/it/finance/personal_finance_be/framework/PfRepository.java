package com.it.finance.personal_finance_be.framework;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PfRepository<T extends PfEntity> extends JpaRepository<T, Long> {
}
