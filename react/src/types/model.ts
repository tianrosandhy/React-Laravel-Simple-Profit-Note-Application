interface Wallet {
    id: number;
    member_id: number;
    title: string;
    balance: number;
    is_default: number;
    created_at: string;
    updated_at: string;
}

interface Label {
    id: number;
    member_id: number;
    title: string;
    color: string,
    created_at: string;
    updated_at: string;
}

interface Transaction {
    id?: number;
    member_id?: number;
    wallet_id: number;
    label_id?: number;
    expense?: number;
    income?: number;
    notes?: string;
    transaction_date?: string;
    wallet_balance?: number;
    total_balance?: number;
    created_at?: string;
    updated_at?: string;
}

interface TransactionReport {
    labels: string[],
    summary: number[],
    wallet_ids: number[],
    wallets_summary: Record<string, number[]>
}

export type { Wallet, Label, Transaction, TransactionReport };