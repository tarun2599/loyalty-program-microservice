// src/models/database.ts
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

class Database {
    private users: Map<string, User> = new Map();

    getUser(userId: string): User | undefined {
        return this.users.get(userId);
    }

    getUserByEmail(email: string): User | undefined {
        return Array.from(this.users.values()).find(user => user.email === email);
    }

    createUser(userId: string, name: string, email: string): User {
        const newUser: User = { id: userId, name, email, balance: 0, transactions: [] };
        this.users.set(userId, newUser);
        return newUser;
    }

    updateUser(user: User): void {
        this.users.set(user.id, user);
    }
}

export default new Database();
