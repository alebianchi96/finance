import PfService from "@/service/PfService.ts";
import MovementDto from "@/dto/finance/MovementDto.ts";
import SearchRequestDto from "@/dto/framework/SearchRequestDto.ts";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto.ts";
import type PfObjectApiResponse from "@/dto/framework/PfObjectApiResponse.ts";
import TransferMovementDto from "@/dto/finance/TransferMovementDto.ts";
import type PaginationState from "@/dto/finance/pagination/PaginationState.ts";
import {DEFAULT_PAGE_SIZE} from "@/dto/finance/pagination/PaginationUtils.ts";

export default class MovementService extends PfService<MovementDto> {

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

    async loadEconomicMovementsByPatrimonialFund(idPatrimonialFund: string | undefined, setState: Function, paginationState: PaginationState|undefined = undefined) {
        const searchRequest = new SearchRequestDto<MovementDto>();
        searchRequest.dto = new MovementDto();

        if(idPatrimonialFund) {
            searchRequest.dto.patrimonialFund = new PatrimonialFundDto();
            searchRequest.dto.patrimonialFund.id = parseInt(idPatrimonialFund);
        }

        // -------------- setting pagination to search ---------------
        searchRequest.size=DEFAULT_PAGE_SIZE;
        if( paginationState?.paginationData?.currentPage ) {
            searchRequest.page = paginationState.paginationData.currentPage ?? 0;
            searchRequest.page = searchRequest.page > 0 ? searchRequest.page -1 : 0;
        }
        // -----------------------------------------------------------

        try {

            const responseWrapped = await fetch(
                `${this.getBackendUrl()}/${this.getDomain()}/search/economics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchRequest)
            });
            let response = await this.readResponse(responseWrapped);
            let lst = response?.dto?.list || [];

            // -------------- setting pagination by search response ---------------
            if( paginationState?.paginationData?.currentPage || paginationState?.paginationData?.currentPage==0 ) {
                let page_number = response?.dto?.pageNumber ?? 0;
                let total_pages = response?.dto?.totalPages ?? 0;
                paginationState.setPaginationData({
                    currentPage: page_number,
                    totalPages: total_pages
                })
            }
            // -------------------------------------------------------------------

            setState( lst );

        } catch (err:any) {
            return await this.manageError(err);
        }

    }

    async loadTransferMovements(setState: Function) {

        const searchRequest = new SearchRequestDto<TransferMovementDto>();
        searchRequest.dto = new TransferMovementDto();

        try {
            const responseWrapped = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/search/transfers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchRequest)
            });
            let response = await this.readResponse(responseWrapped);
            let lst = response?.dto?.list || [];
            setState( lst );
        } catch (err:any) {
            return await this.manageError(err);
        }

    }

    async transferInsert(dto:TransferMovementDto):Promise<PfObjectApiResponse<TransferMovementDto>> {
        // @PostMapping("/insert")
        try{
            const response = await fetch(
                `${this.getBackendUrl()}/${this.getDomain()}/transfers/insert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dto)
            });
            return await this.readResponse(response);
        } catch (err:any) {
            return await this.manageError(err);
        }

    }

    async transferEdit(dto:TransferMovementDto):Promise<PfObjectApiResponse<TransferMovementDto>> {
        // @PutMapping("/edit")
        try {
            const response = await fetch(
                `${this.getBackendUrl()}/${this.getDomain()}/transfers/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dto)
            });
            return await this.readResponse(response);
        } catch (err:any) {
            return await this.manageError(err);
        }
    }

    async transferDelete(blockId:number):Promise<PfObjectApiResponse<void>> {
        // @DeleteMapping("/id/{id}")
        try{
            const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/transfers/block-id/${blockId}`, {
                method: 'DELETE'
            });
            return await this.readResponse(response);
        } catch (err:any) {
            return await this.manageError(err);
        }
    }

}