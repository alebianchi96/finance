import type PfDto from "@/dto/framework/PfDto.ts";

export default class SearchResponseDto<DTO extends PfDto> {
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    list: DTO[];
}