package com.it.finance.personal_finance_be.test;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;


public class Main {

    public static void main(String[] args) {

        Long tmst = 1735599600000L;

        LocalDateTime ldt = Instant.ofEpochMilli(tmst)
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        System.out.println(ldt.getYear()); // true if amount is greater than zero


    }

}