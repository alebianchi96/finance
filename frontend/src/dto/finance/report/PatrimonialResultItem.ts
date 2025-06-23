import PfTypoDto from "@/dto/framework/PfTypoDto.ts";
import type EconomicCategoryDto from "@/dto/finance/EconomicCategoryDto.ts";
import type PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto.ts";

export default class PatrimonialResultItem  {

    // private PatrimonialFundDto patrimonialFund;
    patrimonialFund: PatrimonialFundDto;

    // private BigDecimal amount = BigDecimal.ZERO;
    amount:number = 0;

}