export type LeadStatus = 'New' | 'Contacted' | 'Converted';

export interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: LeadStatus;
    created_at: string;
    updated_at: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export interface LeadFilters {
    search: string;
    status: string;
    sort: string;
    direction: 'asc' | 'desc';
}
