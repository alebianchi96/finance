import PfDto from "@/dto/framework/PfDto.ts";
import type EconomicAccountDto from "@/dto/finance/EconomicAccountDto";
import type PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto";

export default class MovementDto extends PfDto {

    dt:Date | null;
    economicAccount: EconomicAccountDto | null = null;
    note:string | null;
    patrimonialFund: PatrimonialFundDto | null = null;
    amount: number | null;
    blockId: number | null;

}