package com.it.finance.personal_finance_be.dto;

import com.it.finance.personal_finance_be.framework.PfTypoDto;

public class EconomicAccountDto extends PfTypoDto {

    private EconomicCategoryDto economicCategory;

    public EconomicCategoryDto getEconomicCategory() {
        return economicCategory;
    }

    public void setEconomicCategory(EconomicCategoryDto economicCategory) {
        this.economicCategory = economicCategory;
    }

}
