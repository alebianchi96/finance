import PfService from "@/service/PfService.ts";
import EconomicAccountDto from "@/dto/finance/EconomicAccountDto.ts";
import SearchRequestDto from "@/dto/framework/SearchRequestDto.ts";
import EconomicCategoryDto from "@/dto/finance/EconomicCategoryDto.ts";
import type PfObjectApiResponse from "@/dto/framework/PfObjectApiResponse.ts";
import type SearchResponseDto from "@/dto/framework/SearchResponseDto.ts";

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

    async load(
        natureValue:string|undefined,
        codeCategoryValue:string|undefined,
        codeAccountValue:string|undefined,
        setState:Function
    ) {
        const searchRequest = new SearchRequestDto<EconomicAccountDto>();
        searchRequest.dto = new EconomicAccountDto();
        searchRequest.size = 999999
        searchRequest.page = 1;

        if( natureValue && natureValue !== "any" ) {
            searchRequest.dto.economicCategory = searchRequest.dto.economicCategory ?? new EconomicCategoryDto();
            searchRequest.dto.economicCategory.nature = natureValue;
        }

        if (codeCategoryValue) {
            searchRequest.dto.economicCategory = searchRequest.dto.economicCategory ?? new EconomicCategoryDto();
            searchRequest.dto.economicCategory.code = codeCategoryValue;
        }

        if (codeAccountValue) {
            searchRequest.dto.code = codeAccountValue;
        }

        let response : PfObjectApiResponse<SearchResponseDto<EconomicAccountDto>> = await this.search(searchRequest);
        let lst = response?.dto?.list || [];
        if(lst) {
            lst.sort((a, b) => {

                // ordina a cascata per account.economicCategory.nature, account.economicCategory.code, account.code
                // Primo livello: ordina per natura
                if (a.economicCategory.nature !== b.economicCategory.nature) {
                    return a.economicCategory.nature < b.economicCategory.nature ? -1 : 1;
                }

                // Secondo livello: stessa natura, ordina per codice categoria
                if (a.economicCategory.code !== b.economicCategory.code) {
                    return a.economicCategory.code < b.economicCategory.code ? -1 : 1;
                }

                // Terzo livello: stessa categoria, ordina per codice account
                return a.code < b.code ? -1 : 1;

            });
        }
        setState( lst );
    }

}