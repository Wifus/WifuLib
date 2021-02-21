//deno-lint-ignore-file camelcase
export interface Payload {
    op: number;
    d: unknown;
    s: number | null;
    t: string | null;
}

export interface Hello {
    heartbeat_interval: number
}

