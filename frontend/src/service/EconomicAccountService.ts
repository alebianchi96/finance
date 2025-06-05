import PfService from "@/service/PfService.ts";
import type EconomicAccountDto from "@/dto/finance/EconomicAccountDto.ts";

export default class EconomicAccountService extends PfService<EconomicAccountDto>{

    getDomain(): string {
        return "economic-accounts";
    }

    static instance : EconomicAccountService | null  = null;

    static getInstance(): EconomicAccountService {
        if (!this.instance) {
            this.instance = new EconomicAccountService();
        }
        return this.instance;
    }

}