//deno-lint-ignore-file camelcase
export interface Gateway {
    url: string,
    shards: number,
    session_start_limit: {
        total: number, 
        remaining: number,
        reset_after: number,
        max_concurrency: number
    }
}