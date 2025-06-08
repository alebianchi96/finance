import PfService from "@/service/PfService.ts";
import MovementDto from "@/dto/finance/MovementDto.ts";
import SearchRequestDto from "@/dto/framework/SearchRequestDto.ts";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto.ts";
import type PfObjectApiResponse from "@/dto/framework/PfObjectApiResponse.ts";
import type SearchResponseDto from "@/dto/framework/SearchResponseDto.ts";

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

    async load(idPatrimonialFund: string | undefined, page:number | undefined, size:number | undefined, setState: Function) {
        const searchRequest = new SearchRequestDto<MovementDto>();
        searchRequest.dto = new MovementDto();
        searchRequest.size = size ?? 999999
        searchRequest.page = page ?? 1;

        if(idPatrimonialFund) {
            searchRequest.dto.patrimonialFund = new PatrimonialFundDto();
            searchRequest.dto.patrimonialFund.id = parseInt(idPatrimonialFund);
        }

        let response : PfObjectApiResponse<SearchResponseDto<MovementDto>> = await this.search(searchRequest);
        let lst = response?.dto?.list || [];
        if(lst) {
            lst.sort((a, b) => {

                if( a.dt !== b.dt ) {
                    return a.dt < b.dt ? -1 : 1;
                }

                return (a.createdAt.getTime() - b.createdAt.getTime()) < 0 ? -1 : 1;
            });
        }
        setState( lst );

    }

    private async search_(searchRequest:SearchRequestDto<MovementDto>, endpoint : string):Promise<PfObjectApiResponse<SearchResponseDto<MovementDto>>> {
        // @PostMapping("/search")
        const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/search/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchRequest)
        });
        return await this.readResponse(response);
    }

    async loadMovementsByPatrimonialFundAndType(idPatrimonialFund: string | undefined, type : string,  setState: Function) {
        const searchRequest = new SearchRequestDto<MovementDto>();
        searchRequest.dto = new MovementDto();

        if(idPatrimonialFund) {
            searchRequest.dto.patrimonialFund = new PatrimonialFundDto();
            searchRequest.dto.patrimonialFund.id = parseInt(idPatrimonialFund);
        }

        let response : PfObjectApiResponse<SearchResponseDto<MovementDto>> = await this.search_(searchRequest, type);
        let lst = response?.dto?.list || [];
        setState( lst );

    }

}