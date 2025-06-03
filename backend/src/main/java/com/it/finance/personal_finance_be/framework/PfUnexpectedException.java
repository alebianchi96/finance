package com.it.finance.personal_finance_be.framework;

public class PfUnexpectedException extends RuntimeException {

    private final int code;

    private final String internalCode;

    public PfUnexpectedException(int code, String internalCode, String message) {
        super(message);
        this.code = code;
        this.internalCode = internalCode;
    }

    public PfUnexpectedException(String message) {
        super(message);
        this.code = 400;
        this.internalCode = "UNEXPECTED_ERROR";
    }

    public int getCode() {
        return code;
    }

    public String getInternalCode() {
        return internalCode;
    }
}
