import Redis from "ioredis";

export const connection =new Redis({
    host:process.env.REDIS_URL,
    maxRetriesPerRequest:null
})
