import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';
export const ratelimit = new Ratelimit({
    redis,
    // 10 reqs within 10s cause timeout
    //https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms#sliding-window
    limiter: Ratelimit.slidingWindow(5, '10s'),
});
