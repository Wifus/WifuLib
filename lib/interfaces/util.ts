export interface ClientOptions {
    token: string,
}

export type Events = 
    "debug" | 
    "shardDisconnect";

export interface ShardDisconnect {
    reconnect: boolean
    sequenceNumber: number,
    sessionId: string
}