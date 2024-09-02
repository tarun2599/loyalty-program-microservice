// src/types.ts

export interface Transaction {
    id: string;
    type: 'earn' | 'spend';
    amount: number;
    date: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    balance: number;
    transactions: Transaction[];
}
