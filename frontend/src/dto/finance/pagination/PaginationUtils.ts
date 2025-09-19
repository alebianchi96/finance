export const DISABLED_BTN_CLASS = "bg-gray-200 opacity-50 text-black cursor-not-allowed";

export const isActivePrevButton = (paginationData: PaginationData | undefined) => {
    return (paginationData?.currentPage ?? 0) <= 1
}

export const isActiveSuccButton = (paginationData: PaginationData | undefined) => {
    return (paginationData?.totalPages ?? 0) <= (paginationData?.currentPage ?? 0)
}

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGINATION_DATA: PaginationData = { currentPage: 0, totalPages: DEFAULT_PAGE_SIZE };