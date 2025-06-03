package com.it.finance.personal_finance_be.framework;

import java.util.List;

public class PfObjectApiResponse<DTO> extends PfApiResponse {

    public static <DTO> PfObjectApiResponse<DTO> ok(DTO dto) {
        PfObjectApiResponse<DTO> response = new PfObjectApiResponse<>();
        response.setDto(dto);
        response.setMessage(null);
        response.setInternalCode(null);
        response.setSuccess(true);
        response.setStatusCode(200);
        return response;
    }

    public static <DTO> PfObjectApiResponse<DTO> ko(int code, String internalCode, String message) {
        PfObjectApiResponse<DTO> response = new PfObjectApiResponse<>();
        response.setDto(null);
        response.setMessage(message);
        response.setInternalCode(internalCode);
        response.setSuccess(false);
        response.setStatusCode(code);
        return response;
    }

    private DTO dto;

    public DTO getDto() {
        return dto;
    }

    public void setDto(DTO dto) {
        this.dto = dto;
    }

}
