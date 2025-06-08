import type PfObjectApiResponse from "@/dto/framework/PfObjectApiResponse.ts";
import type PfListApiResponse from "@/dto/framework/PfListApiResponse.ts";
import type SearchRequestDto from "@/dto/framework/SearchRequestDto.ts";
import type PfDto from "@/dto/framework/PfDto.ts";
import type SearchResponseDto from "@/dto/framework/SearchResponseDto.ts";

export default abstract class PfService<DTO extends PfDto> {

    protected getBackendUrl() { return "http://localhost:8080" }

    abstract getDomain() : string;

    protected async readResponse(response:Response) {
        if (!response.ok) {
            console.error(response);
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log(data);

        if(!data.success) {
            console.error(data);
            alert( data.message )
        }

        return data;
    }

    async findById(id:number):Promise<PfObjectApiResponse<DTO>> {
        const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/id/${id}`)
        return await this.readResponse(response);
    }

    async findAll():Promise<PfListApiResponse<DTO>> {
        // @GetMapping("/all")
        const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/all`);
        return await this.readResponse(response);
    }

    async search(searchRequest:SearchRequestDto<DTO>):Promise<PfObjectApiResponse<SearchResponseDto<DTO>>> {
        // @PostMapping("/search")
        const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchRequest)
        });
        return await this.readResponse(response);
    }

    async insert(dto:DTO):Promise<PfObjectApiResponse<DTO>> {
        // @PostMapping("/insert")
        const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        });

        return await this.readResponse(response);
    }

    async edit(dto:DTO):Promise<PfObjectApiResponse<DTO>> {
        // @PutMapping("/edit")
        const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        });

        return await this.readResponse(response);
    }

    async delete(id:number):Promise<PfObjectApiResponse<void>> {
        // @DeleteMapping("/id/{id}")
        const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/id/${id}`, {
            method: 'DELETE'
        });
        return await this.readResponse(response);
    }


}