import PfService from "@/service/PfService.ts";
import type MovementDto from "@/dto/finance/MovementDto.ts";

export default class MovementService extends PfService<MovementDto>{

    getDomain(): string {
        return "movements";
    }

    static instance : MovementService | null  = null;

    static getInstance(): MovementService {
        if (!this.instance) {
            this.instance = new MovementService();
        }
        return this.instance;
    }

}