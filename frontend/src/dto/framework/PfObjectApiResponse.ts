import PfApiResponse from "@/dto/framework/PfApiResponse.ts";

export default class PfObjectApiResponse<DTO> extends PfApiResponse {
    dto: DTO;
}