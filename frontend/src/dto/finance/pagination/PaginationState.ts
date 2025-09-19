import type PaginationData from "@/dto/finance/pagination/PaginationData.ts";

export default interface PaginationState {
    paginationData: PaginationData | undefined;
    setPaginationData: Function | undefined;
}