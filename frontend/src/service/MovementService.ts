import PfService from "@/service/PfService.ts";
import MovementDto from "@/dto/finance/MovementDto.ts";
import SearchRequestDto from "@/dto/framework/SearchRequestDto.ts";
import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto.ts";
import type PfObjectApiResponse from "@/dto/framework/PfObjectApiResponse.ts";
import type SearchResponseDto from "@/dto/framework/SearchResponseDto.ts";
import TransferMovementDto from "@/dto/finance/TransferMovementDto.ts";

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

    async loadEconomicMovementsByPatrimonialFund(idPatrimonialFund: string | undefined, setState: Function) {
        const searchRequest = new SearchRequestDto<MovementDto>();
        searchRequest.dto = new MovementDto();

        if(idPatrimonialFund) {
            searchRequest.dto.patrimonialFund = new PatrimonialFundDto();
            searchRequest.dto.patrimonialFund.id = parseInt(idPatrimonialFund);
        }

        const responseWrapped = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/search/economics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchRequest)
        });
        let response = await this.readResponse(responseWrapped);


        let lst = response?.dto?.list || [];
        setState( lst );

    }

    async loadTransferMovements(setState: Function) {

        const searchRequest = new SearchRequestDto<TransferMovementDto>();
        searchRequest.dto = new TransferMovementDto();

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

    }

    async transferInsert(dto:TransferMovementDto):Promise<PfObjectApiResponse<TransferMovementDto>> {
        // @PostMapping("/insert")
        const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/transfers/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        });

        return await this.readResponse(response);
    }

    async transferEdit(dto:TransferMovementDto):Promise<PfObjectApiResponse<TransferMovementDto>> {
        // @PutMapping("/edit")
        const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/transfers/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        });

        return await this.readResponse(response);
    }

    async transferDelete(blockId:number):Promise<PfObjectApiResponse<void>> {
        // @DeleteMapping("/id/{id}")
        const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/transfers/block-id/${blockId}`, {
            method: 'DELETE'
        });
        return await this.readResponse(response);
    }

}