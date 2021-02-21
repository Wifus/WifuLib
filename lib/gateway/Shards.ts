import { ShardManagerOptions, ShardOptions } from "../interfaces/client.ts";
import { WebSocketManager } from "./Shard.ts";
import type { Client } from "../client.ts";

//Needs to manage shards that need to reconnect
//Then make sure that reconnects are only attempted once per the identify interval
class ShardManager extends Map {

    #client: Client;

    constructor(client: Client) {
        super();
        this.#client = client;
    }

    start(options: ShardManagerOptions) {
        for (let i = 0; i < options.numShards; i++) {
            setTimeout(() => {
                const shardOptions: ShardOptions = { id: i, ...options };
                const shard = new WebSocketManager(shardOptions, this.#client);
                shard.connect();
                this.set(i, shard);
            }, i * options.identifyInterval);
        }
    }

}

export { ShardManager }