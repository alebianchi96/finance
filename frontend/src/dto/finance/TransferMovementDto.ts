import PfDto from "@/dto/framework/PfDto.ts";
import type EconomicAccountDto from "@/dto/finance/EconomicAccountDto";
import type PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto";

export default class TransferMovementDto extends PfDto {

    dt:Date | null;

    note:string | null;

    idTo: number | null;
    patrimonialFundTo: PatrimonialFundDto | null = null;

    amount: number | null;

    idFrom: number | null;
    patrimonialFundFrom: PatrimonialFundDto | null = null;

}