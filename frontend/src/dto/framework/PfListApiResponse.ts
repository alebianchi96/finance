import PfApiResponse from "@/dto/framework/PfApiResponse.ts";

export default class PfListApiResponse<DTO> extends PfApiResponse {
    list: DTO[];
}