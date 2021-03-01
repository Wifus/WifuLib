//deno-lint-ignore-file no-explicit-any
/*
*   Types for client paramaters
*/
export interface ClientOptions {
    token: string;
}

export interface ShardManagerOptions {
    numShards: number;
    identifyInterval: number;
    wsUrl: string;
}

export interface ShardOptions extends ShardManagerOptions {
    id: number;
}

export type Events =
    "debug" |
    "shardDisconnect";

export type Handler = (data?: any) => void;

export interface ShardDisconnect {
    reconnect: boolean;
    sequenceNumber: number;
    sessionId: string;
}