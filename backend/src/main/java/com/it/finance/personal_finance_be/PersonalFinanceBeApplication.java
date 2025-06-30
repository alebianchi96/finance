package com.it.finance.personal_finance_be;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = {
		"com.it.finance.personal_finance_be.entity",
		"com.it.finance.personal_finance_be.framework",
		"com.it.finance.personal_finance_be.dao"
})
@Log4j2
public class PersonalFinanceBeApplication implements CommandLineRunner {

	@Value("${db.host}")
	private String dbHost;

	public static void main(String[] args) {
		SpringApplication.run(PersonalFinanceBeApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		log.info( " " );
		log.info( "=================== START => ENV VAR ===================" );
		log.info( "db.host='"+dbHost+"'" );
		log.info( "=================== END => ENV VAR ===================" );
		log.info( " " );

	}
}
