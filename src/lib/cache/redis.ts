import { createClient } from 'redis';

interface CacheConfig {
  url?: string;
  password?: string;
  db?: number;
}

class RedisCache {
  private client: ReturnType<typeof createClient> | null = null;
  private isConnected = false;

  constructor(private config: CacheConfig = {}) {}

  async connect() {
    if (this.isConnected) return;

    try {
      // For production, use Redis URL from environment
      // For development, use local Redis or fallback to in-memory cache
      const redisUrl = this.config.url || process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.client = createClient({
        url: redisUrl,
        password: this.config.password || process.env.REDIS_PASSWORD,
        database: this.config.db || parseInt(process.env.REDIS_DB || '0'),
      });

      this.client.on('error', (err) => {
        console.warn('Redis connection error:', err.message);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis connected successfully');
        this.isConnected = true;
      });

      await this.client.connect();
    } catch (error) {
      console.warn('Redis connection failed, falling back to in-memory cache:', error);
      this.isConnected = false;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.client) {
      return null;
    }

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    if (!this.isConnected || !this.client) {
      return [];
    }

    try {
      return await this.client.keys(pattern);
    } catch (error) {
      console.error('Redis KEYS error:', error);
      return [];
    }
  }
}

// Singleton instance
let redisCache: RedisCache | null = null;

export function getRedisCache(): RedisCache {
  if (!redisCache) {
    redisCache = new RedisCache();
  }
  return redisCache;
}

// Cache keys
export const CACHE_KEYS = {
  INSTAGRAM_POSTS: 'instagram:posts',
  INSTAGRAM_TOKEN: 'instagram:token',
  CONTENT_STATUS: 'content:status',
  PROJECTS: 'projects:all',
  EDITORIALS: 'editorials:all',
  LISTINGS: 'listings:all',
} as const;

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  INSTAGRAM_POSTS: 3600, // 1 hour
  INSTAGRAM_TOKEN: 7200, // 2 hours
  CONTENT_STATUS: 300, // 5 minutes
  PROJECTS: 1800, // 30 minutes
  EDITORIALS: 1800, // 30 minutes
  LISTINGS: 1800, // 30 minutes
} as const;

// Helper functions
export async function cacheInstagramPosts(posts: any[]) {
  const cache = getRedisCache();
  await cache.connect();
  return cache.set(CACHE_KEYS.INSTAGRAM_POSTS, posts, CACHE_TTL.INSTAGRAM_POSTS);
}

export async function getCachedInstagramPosts(): Promise<any[] | null> {
  const cache = getRedisCache();
  await cache.connect();
  return cache.get(CACHE_KEYS.INSTAGRAM_POSTS);
}

export async function cacheInstagramToken(token: string) {
  const cache = getRedisCache();
  await cache.connect();
  return cache.set(CACHE_KEYS.INSTAGRAM_TOKEN, token, CACHE_TTL.INSTAGRAM_TOKEN);
}

export async function getCachedInstagramToken(): Promise<string | null> {
  const cache = getRedisCache();
  await cache.connect();
  return cache.get(CACHE_KEYS.INSTAGRAM_TOKEN);
}

export async function clearInstagramCache() {
  const cache = getRedisCache();
  await cache.connect();
  await cache.del(CACHE_KEYS.INSTAGRAM_POSTS);
  await cache.del(CACHE_KEYS.INSTAGRAM_TOKEN);
}
