import type PfDto from "@/dto/framework/PfDto.ts";

export default class SearchRequestDto<DTO extends PfDto> {
    dto: DTO;
    page: number;
    size: number;
}