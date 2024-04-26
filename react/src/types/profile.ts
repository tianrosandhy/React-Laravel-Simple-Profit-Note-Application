interface Profile {
    id: number;
    whatsapp_number: string;
    full_name: string;
    merchant_title?: string;
    image?: string;
    status: string;
    balance: number;
    created_at: string;
    updated_at: string;
}

export type {Profile};