import PfService from "@/service/PfService.ts";
import type PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto.ts";

export default class PatrimonialFundService extends PfService<PatrimonialFundDto>{

    getDomain(): string {
        return "patrimonial-funds";
    }

    static instance : PatrimonialFundService | null  = null;

    static getInstance(): PatrimonialFundService {
        if (!this.instance) {
            this.instance = new PatrimonialFundService();
        }
        return this.instance;
    }

}