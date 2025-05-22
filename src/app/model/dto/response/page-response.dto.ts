export interface PageResponseDto<T> {
    data: T[];
    meta: {
        page: string;
        take: string;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
}