import Redis from "ioredis";

export const connection =new Redis({
    host:process.env.REDIS_URL,
    port:process.env.REDIS_PORT,
    maxRetriesPerRequest:null
})
