import PfService from "@/service/PfService.ts";
import type EconomicCategoryDto from "@/dto/finance/EconomicCategoryDto.ts";

export default class EconomicCategoryService extends PfService<EconomicCategoryDto>{

    getDomain(): string {
        return "economic-categories";
    }

    static instance : EconomicCategoryService | null  = null;

    static getInstance(): EconomicCategoryService {
        if (!this.instance) {
            this.instance = new EconomicCategoryService();
        }
        return this.instance;
    }

}