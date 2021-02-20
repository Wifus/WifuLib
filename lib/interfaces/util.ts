export interface ClientOptions {
    token: string,
}

export interface ShardManagerOptions {
    numShards: number,
    identifyInterval: number,
    wsUrl: string
}

export interface ShardOptions extends ShardManagerOptions {
    id: number
}

export type Events =
    "debug" |
    "shardDisconnect";

export interface ShardDisconnect {
    reconnect: boolean
    sequenceNumber: number,
    sessionId: string
}