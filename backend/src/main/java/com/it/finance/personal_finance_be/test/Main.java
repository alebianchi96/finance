package com.it.finance.personal_finance_be.test;

import java.time.LocalDateTime;


public class Main {

    public static void main(String[] args) {

        Long dtTimestamp = 1749393461571L;

        LocalDateTime dt = LocalDateTime.ofEpochSecond(
                dtTimestamp / 1000, 0, java.time.ZoneOffset.UTC);


        System.out.println(dt);


    }

}