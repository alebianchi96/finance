package com.it.finance.personal_finance_be.dto;

import com.it.finance.personal_finance_be.framework.PfTypoDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class EconomicCategoryDto extends PfTypoDto {

    private String nature;

    private Integer ordering;

}
