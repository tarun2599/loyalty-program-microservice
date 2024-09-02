// src/utils/cache.ts
import { User } from '../types';

interface CacheItem<T> {
    value: T;
    expiry: number;
}

class Cache<T> {
    private cache: Map<string, CacheItem<T>> = new Map();
    private defaultTTL: number = 60 * 1000; // 1 minute default time-to-live

    constructor(defaultTTL?: number) {
        if (defaultTTL) {
            this.defaultTTL = defaultTTL;
        }
    }

    set(key: string, value: T, ttl?: number): void {
        const expiry = Date.now() + (ttl || this.defaultTTL);
        this.cache.set(key, { value, expiry });
    }

    get(key: string): T | undefined {
        const item = this.cache.get(key);

        if (!item) {
            return undefined;
        }

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return undefined;
        }

        return item.value;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}

export default Cache;
