import PatrimonialFundDto from "@/dto/finance/PatrimonialFundDto.ts";
import type MovementDto from "@/dto/finance/MovementDto.ts";

export default class PatrimonialFundInitDto extends PatrimonialFundDto{

    initialMovement: MovementDto | null;

    constructor() {
        super();
    }

}