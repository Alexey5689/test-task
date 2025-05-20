export interface Tender {
    id: number;
    title: string;
    description: string;
}
export interface TendersResponse<T> {
    data: T[];
}
