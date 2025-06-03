package com.it.finance.personal_finance_be.framework;

import java.util.List;

public class SearchResponseDto<DTO extends PfDto> {

    private long totalElements;
    private int totalPages;
    private int pageNumber;
    private int pageSize;
    private List<DTO> list;

    public List<DTO> getList() {
        return list;
    }

    public void setList(List<DTO> list) {
        this.list = list;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

}
