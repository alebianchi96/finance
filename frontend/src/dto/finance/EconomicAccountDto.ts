import PfTypoDto from "@/dto/framework/PfTypoDto.ts";
import type EconomicCategoryDto from "@/dto/finance/EconomicCategoryDto.ts";

export default class EconomicAccountDto extends PfTypoDto {

    economicCategory: EconomicCategoryDto | null = null;

}