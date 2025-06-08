import PfService from "@/service/PfService.ts";
import EconomicCategoryDto from "@/dto/finance/EconomicCategoryDto.ts";
import SearchRequestDto from "@/dto/framework/SearchRequestDto.ts";
import type PfObjectApiResponse from "@/dto/framework/PfObjectApiResponse.ts";
import type SearchResponseDto from "@/dto/framework/SearchResponseDto.ts";

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

    async load(
        natureValue:string|undefined,
        codeValue:string|undefined,
        setState:Function
    ) {
        // API call to load categories
        const searchRequest = new SearchRequestDto<EconomicCategoryDto>();
        searchRequest.dto = new EconomicCategoryDto();
        searchRequest.size = 999999
        searchRequest.page = 1;

        if( natureValue && natureValue !== "any" ) {
            searchRequest.dto.nature = natureValue;
        }

        if (codeValue) {
            searchRequest.dto.code = codeValue;
        }

        let response : PfObjectApiResponse<SearchResponseDto<EconomicCategoryDto>> = await this.search(searchRequest);
        let lst = response?.dto?.list || [];
        if(lst) {
            lst.sort((a, b) => {

                if( a.nature==b.nature ) {
                    return a.code < b.code ? -1 : 1;
                }
                return a.nature < b.nature ? -1 : 1;

            });
        }
        setState( lst );
    }

}