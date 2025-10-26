import PfService from "@/service/PfService.ts";
import MovementDto from "@/dto/finance/MovementDto.ts";
import type PfObjectApiResponse from "@/dto/framework/PfObjectApiResponse.ts";
import PatrimonialResultDto from "@/dto/finance/report/PatrimonialResultDto.ts";
import EconomicAccountDto from "@/dto/finance/report/EconomicResultDto.ts";
import DateUtils from "@/lib/DateUtils.ts";
import type VEconomicResultDetailDto from "@/dto/finance/report/view/VEconomicResultDetailDto.ts";
import type VEconomicResultDto from "@/dto/finance/report/view/VEconomicResultDto.ts";

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

    async listYearsWithTransactions() : Promise<number[]> {
        try {

            const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/years`);
            let lstYears = [ Number.parseInt(DateUtils.currentYearAsString()) ];
            if (response?.ok) {
                lstYears = await response?.json();
            }
            return lstYears;

        } catch (err:any) {
            return await this.manageError(err);
        }
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

    async testRetrieveReport(selectedYear: string) {
        let ec = await this.getVEconomicResult( selectedYear );

        console.log("economic-result: ", ec);

        let ecd = await this.getVEconomicDetailResult( selectedYear );

        console.log("economic-result-detail: ", ecd);

    }


    async getVEconomicResult( selectedYear:string ) : Promise<VEconomicResultDto[]> {
        if( !selectedYear ) {
            return undefined;
        }
        return await this.retrieveVEconomicReport( `economic/result/year/${selectedYear}` );
    }

    async getVEconomicDetailResult( selectedYear:string ) : Promise<VEconomicResultDetailDto[]> {
        if( !selectedYear ) {
            return undefined;
        }
        return await this.retrieveVEconomicReport( `economic/result/detail/year/${selectedYear}` );
    }

    private async retrieveVEconomicReport( url:string ): Promise<any> {

        try {

            const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/${url}`);
            if (!response?.ok) {
                console.error(response);
                throw new Error(`Error fetching data: ${response?.statusText}`);
            }
            return await response?.json();

        } catch (err:any) {
            return await this.manageError(err);
        }

    }



}