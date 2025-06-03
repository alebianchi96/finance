package com.it.finance.personal_finance_be.dto;

import com.it.finance.personal_finance_be.framework.PfTypoDto;

public class EconomicCategoryDto extends PfTypoDto {

    private String nature;

    public String getNature() {
        return nature;
    }

    public void setNature(String nature) {
        this.nature = nature;
    }

}
