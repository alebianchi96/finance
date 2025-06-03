package com.it.finance.personal_finance_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = {
		"com.it.finance.personal_finance_be.entity",
		"com.it.finance.personal_finance_be.framework",
		"com.it.finance.personal_finance_be.dao"
})
public class PersonalFinanceBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(PersonalFinanceBeApplication.class, args);
	}

}
