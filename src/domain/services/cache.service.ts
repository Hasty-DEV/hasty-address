interface ICache<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V, ttl?: number): void;
  delete(key: K): void;
  clear(): void;
  has(key: K): boolean;
}

export class InMemoryCache<K, V> implements ICache<K, V> {
  private cache: Map<K, { value: V; expiresAt?: number }>;

  constructor() {
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    const cachedItem = this.cache.get(key);

    if (!cachedItem) {
      return undefined;
    }

    if (cachedItem.expiresAt && cachedItem.expiresAt < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }

    return cachedItem.value;
  }

  set(key: K, value: V, ttl?: number): void {
    const expiresAt = ttl ? Date.now() + ttl : undefined;
    this.cache.set(key, { value, expiresAt });
  }

  delete(key: K): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: K): boolean {
    const item = this.cache.get(key);
    if (item && item.expiresAt && item.expiresAt < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    return this.cache.has(key);
  }
}
