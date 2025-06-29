package com.it.finance.personal_finance_be.dto;

import org.springframework.beans.BeanUtils;

public class PatrimonialFundInitDto extends PatrimonialFundDto {

    public PatrimonialFundInitDto(){}

    public PatrimonialFundInitDto(PatrimonialFundDto pf, MovementDto mov){
        BeanUtils.copyProperties(pf, this);
        this.setInitialMovement(mov);
    }

    private MovementDto initialMovement;

    public MovementDto getInitialMovement() {
        return initialMovement;
    }

    public void setInitialMovement(MovementDto initialMovement) {
        this.initialMovement = initialMovement;
    }

}
