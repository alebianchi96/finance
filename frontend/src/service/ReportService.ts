import PfService from "@/service/PfService.ts";
import MovementDto from "@/dto/finance/MovementDto.ts";
import type PfObjectApiResponse from "@/dto/framework/PfObjectApiResponse.ts";
import PatrimonialResultDto from "@/dto/finance/report/PatrimonialResultDto.ts";
import EconomicAccountDto from "@/dto/finance/report/EconomicResultDto.ts";

export default class ReportService extends PfService<MovementDto> {

    getDomain(): string {
        return "report";
    }

    static instance : ReportService | null  = null;

    static getInstance(): ReportService {
        if (!this.instance) {
            this.instance = new ReportService();
        }
        return this.instance;
    }

    async getEconomicResult(from:Date, to:Date):Promise<PfObjectApiResponse<EconomicAccountDto>> {
        // EconomicAccountDto
        let dtFromAsLong = from.getTime();
        let dtToAsLong = to.getTime();
        try {
            const response = await fetch(
                `${this.getBackendUrl()}/${this.getDomain()}/economic/from/${dtFromAsLong}/to/${dtToAsLong}`);
            return await this.readResponse(response);
        } catch (err:any) {
            return await this.manageError(err);
        }
    }

    async getPatrimonialResult(refDate:Date):Promise<PfObjectApiResponse<PatrimonialResultDto>> {
        // PatrimonialResultDto
        let dateRefAsLong = refDate.getTime();
        try {
            const response = await fetch(
                `${this.getBackendUrl()}/${this.getDomain()}/patrimonial/date/${dateRefAsLong}`);
            return await this.readResponse(response);
        } catch (err:any) {
            return await this.manageError(err);
        }
    }

}