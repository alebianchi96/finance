package com.it.finance.personal_finance_be.test;

import java.math.BigDecimal;
import java.time.LocalDateTime;


public class Main {

    public static void main(String[] args) {

        BigDecimal amount = BigDecimal.valueOf(1000.00);

        System.out.println("Positive: " + (amount.compareTo(BigDecimal.ZERO) > 0)); // true if amount is greater than zero

        System.out.println("Negative: " + (amount.compareTo(BigDecimal.ZERO) < 0));


    }

}