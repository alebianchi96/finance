package com.it.finance.personal_finance_be.framework;

public class SearchRequestDto<DTO extends PfDto> {

    private DTO dto;

    private int page;

    private int size;

    public DTO getDto() {
        return dto;
    }

    public void setDto(DTO dto) {
        this.dto = dto;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

}
