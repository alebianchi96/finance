import PfTypoDto from "@/dto/framework/PfTypoDto.ts";
import type EconomicCategoryDto from "@/dto/finance/EconomicCategoryDto.ts";
import type PatrimonialResultItem from "@/dto/finance/report/PatrimonialResultItem.ts";

export default class PatrimonialResultDto  {

    // private BigDecimal totalAmount = BigDecimal.ZERO;
    totalAmount:number = 0;

    // private List<PatrimonialResultItem> listItems = new ArrayList<>();
    listItems: PatrimonialResultItem[] = [];

}