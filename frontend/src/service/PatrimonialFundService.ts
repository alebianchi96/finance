import PfService from "@/service/PfService.ts";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto.ts";
import SearchRequestDto from "@/dto/framework/SearchRequestDto.ts";
import type SearchResponseDto from "@/dto/framework/SearchResponseDto.ts";
import type PfObjectApiResponse from "@/dto/framework/PfObjectApiResponse";
import type PatrimonialFundInitDto from "@/dto/finance/PatrimonialFundInitDto.ts";
import {filterInitItems} from "@/lib/utils.ts";

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


    async load(codeValue:string|undefined, setState:Function) {
        // API call to load categories
        const searchRequest = new SearchRequestDto<PatrimonialFundDto>();
        searchRequest.dto = new PatrimonialFundDto();
        searchRequest.size = 999999
        searchRequest.page = 1;
        if (codeValue) {
            searchRequest.dto.code = codeValue;
        }

        let response : PfObjectApiResponse<SearchResponseDto<PatrimonialFundDto>> = await this.search(searchRequest);
        let lst = response?.dto?.list || [];

        // tolgo le categorie, i conti e i fondi d'appoggio usati per l'inizializzazione
        lst = filterInitItems(lst);

        if(lst) {
            lst.sort((a, b) => {
                return a.code < b.code ? -1 : 1;
            });
        }
        setState( lst );
    }


    async loadFundWithInit(codeValue:string|undefined, setState:Function) {
        // API call to load categories
        const searchRequest = new SearchRequestDto<PatrimonialFundDto>();
        searchRequest.dto = new PatrimonialFundDto();
        searchRequest.size = 999999
        searchRequest.page = 1;
        if (codeValue) {
            searchRequest.dto.code = codeValue;
        }

        let response : PfObjectApiResponse<SearchResponseDto<PatrimonialFundInitDto>>;// = await this.search(searchRequest);

        let subResponse = null;
        try {
            const response = await fetch(
                `${this.getBackendUrl()}/${this.getDomain()}/search-with-init`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(searchRequest)
                });
            subResponse = await this.readResponse(response);
        } catch (err:any) {
            return await this.manageError(err);
        }
        let lst = subResponse?.dto?.list || [];

        // tolgo le categorie, i conti e i fondi d'appoggio usati per l'inizializzazione
        lst = filterInitItems(lst);

        if(lst) {
            lst.sort((a, b) => {
                return a.code < b.code ? -1 : 1;
            });
        }
        setState( lst );
    }


    async fundAmountByIdAtDate(idPatrimonialFund: string, dt : Date,  setState: Function) {
        try{
            const response = await fetch(
                `${this.getBackendUrl()}/${this.getDomain()}/fund/${idPatrimonialFund}/at/${dt.getTime()}`);
            let res = await this.readResponse(response);
            // console.log("Fund amount: ", res.dto)
            setState(res.dto || 0);
        } catch (err:any) {
            return await this.manageError(err);
        }
    }


}