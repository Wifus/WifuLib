//deno-lint-ignore-file no-explicit-any
/*
*   Types for client paramaters
*/
import { Discord } from "../deps.ts";

export interface ClientOptions {
    token: string;
    intents: Discord.GatewayIntentBits[];
}

export interface ShardManagerOptions {
    numShards: number;
    identifyInterval: number;
    wsUrl: string;
    intents: number;
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