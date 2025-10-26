import type PatrimonialResultDto from "@/dto/finance/report/PatrimonialResultDto.ts";

export default interface PatrimonialReport {
    patrimonialStartYear: PatrimonialResultDto | undefined,
    patrimonialEndYear: PatrimonialResultDto | undefined,
    yearResult: number | undefined
}