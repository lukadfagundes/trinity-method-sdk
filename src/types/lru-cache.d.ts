/**
 * Type declarations for lru-cache module
 */

declare module 'lru-cache' {
  export namespace LRUCache {
    type DisposeReason = 'evict' | 'set' | 'delete';
  }

  export class LRUCache<K = any, V = any> {
    constructor(options: any);
    get(key: K): V | undefined;
    set(key: K, value: V, options?: any): void;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    peek(key: K): V | undefined;
    getRemainingTTL(key: K): number;
    purgeStale(): void;
    size: number;
  }
}
