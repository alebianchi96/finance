import type PfObjectApiResponse from "@/dto/framework/PfObjectApiResponse.ts";
import type PfListApiResponse from "@/dto/framework/PfListApiResponse.ts";
import type SearchRequestDto from "@/dto/framework/SearchRequestDto.ts";
import type PfDto from "@/dto/framework/PfDto.ts";
import type SearchResponseDto from "@/dto/framework/SearchResponseDto.ts";
import CustomAlert from "@/components/custom/CustomAlert.ts";

export default abstract class PfService<DTO extends PfDto> {

    protected getBackendUrl() { return "http://localhost:8080" }

    abstract getDomain() : string;

    protected async readResponse(response:Response) {
        if (!response?.ok) {
            console.error(response);
            throw new Error(`Error fetching data: ${response?.statusText}`);
        }
        const data = await response?.json();
        // console.log(data);

        if(!data.success) {
            console.error(data);
            alert( data.message )
        }

        return data;
    }

    protected async manageError(err:any):Promise<null> {
        console.error(err);
        // alert('Si è verificato un errore imprevisto durante la richiesta al server. Riprova più tardi.');

        CustomAlert.show("Personal Finance", "Si è verificato un errore imprevisto durante la richiesta al server. Riprova più tardi.");
        return null;
    }


    async findById(id:number):Promise<PfObjectApiResponse<DTO>> {
        try {
            const response = await fetch(
                `${this.getBackendUrl()}/${this.getDomain()}/id/${id}`)
            return await this.readResponse(response);
        } catch (err:any) {
            return await this.manageError(err);
        }
    }

    async findAll():Promise<PfListApiResponse<DTO>> {
        // @GetMapping("/all")
        try {
            const response = await fetch(
                `${this.getBackendUrl()}/${this.getDomain()}/all`);
            return await this.readResponse(response);
        } catch (err:any) {
            return await this.manageError(err);
        }
    }

    async search(searchRequest:SearchRequestDto<DTO>):Promise<PfObjectApiResponse<SearchResponseDto<DTO>>> {
        // @PostMapping("/search")
        try {
            const response = await fetch(
                `${this.getBackendUrl()}/${this.getDomain()}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchRequest)
            });
            return await this.readResponse(response);
        } catch (err:any) {
            return await this.manageError(err);
        }
    }

    async insert(dto:DTO):Promise<PfObjectApiResponse<DTO>> {
        // @PostMapping("/insert")
        try{
            const response = await fetch(
                `${this.getBackendUrl()}/${this.getDomain()}/insert`, {
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

    async edit(dto:DTO):Promise<PfObjectApiResponse<DTO>> {
        // @PutMapping("/edit")
        try {
            const response = await fetch(
                `${this.getBackendUrl()}/${this.getDomain()}/edit`, {
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

    async delete(id:number):Promise<PfObjectApiResponse<void>> {
        // @DeleteMapping("/id/{id}")
        try {
            const response = await fetch(`${this.getBackendUrl()}/${this.getDomain()}/id/${id}`, {
                method: 'DELETE'
            });
            return await this.readResponse(response);
        } catch (err:any) {
            return await this.manageError(err);
        }
    }


}