// TODO: Redis client — NOT YET IMPLEMENTED.
//
// WHY THIS FILE EXISTS: ratelimit.middleware.ts uses an in-memory Map as its
// rate-limit store. That Map is local to each Node.js process, so horizontal
// scaling (multiple app instances) means each instance has its own independent
// counter — one user can exceed the rate limit on instance A while instance B
// still allows them through. A shared Redis store fixes this.
//
// HOW TO SWAP IN REDIS WHEN READY:
//   1. Install a Redis client:
//        npm install ioredis          (self-hosted / Redis Cloud)
//        npm install @upstash/redis   (Upstash serverless)
//   2. Add REDIS_URL to infra/env/.env.* and .env.example
//   3. Implement and export a client below, e.g.:
//        import Redis from 'ioredis'
//        if (!process.env.REDIS_URL) throw new Error('REDIS_URL is not set')
//        export const redis = new Redis(process.env.REDIS_URL)
//   4. Replace the `store` Map in ratelimit.middleware.ts with redis.get/set calls.
//
// Delete this file and replace with a real client when step 3 is done.
