//deno-lint-ignore-file camelcase
/*
*   Types recived from Discord
*/
export type snowflake = string;

export interface Payload {
    op: number;
    d: unknown;
    s: number | null;
    t: string | null;
}

export interface Hello {
    heartbeat_interval: number
}

export interface DiscordGateway {
    url: string;
    shards: number;
    session_start_limit: {
        total: number;
        remaining: number;
        reset_after: number;
        max_concurrency: number;
    }
}

export interface DiscordUser {
    id: snowflake;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot?: boolean;
}

