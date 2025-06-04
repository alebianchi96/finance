import PfDto from "@/dto/framework/PfDto.ts";
import type EconomicAccountDto from "@/dto/finance/EconomicAccountDto";
import type PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto";

export default class MovementDto extends PfDto {

    dt:Date = new Date();
    economicAccount: EconomicAccountDto | null = null;
    note:string = '';
    patrimonialFund: PatrimonialFundDto | null = null;
    amount: number = 0;
    blockId: number = 0;

}