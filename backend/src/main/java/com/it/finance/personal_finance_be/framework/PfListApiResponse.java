package com.it.finance.personal_finance_be.framework;

import java.util.List;

public class PfListApiResponse<DTO> extends PfApiResponse {

    public static <DTO> PfListApiResponse<DTO> ok(List<DTO> list) {
        PfListApiResponse<DTO> response = new PfListApiResponse<>();
        response.setList(list);
        response.setMessage(null);
        response.setSuccess(true);
        response.setStatusCode(200);
        return response;
    }

    public static <DTO> PfListApiResponse<DTO> ko(String message, int code) {
        PfListApiResponse<DTO> response = new PfListApiResponse<>();
        response.setList(null);
        response.setMessage(message);
        response.setSuccess(false);
        response.setStatusCode(code);
        return response;
    }

    private List<DTO> list;

    public List<DTO> getList() {
        return list;
    }

    public void setList(List<DTO> list) {
        this.list = list;
    }

}
