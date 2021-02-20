import { WebSocketManager } from "./Shard.ts";
import type { Client } from "../client.ts";

class ShardManager extends Map {

    #client: Client;
    #numShards: number;
    #identifyInterval: number; //In ms

    constructor(client: Client) {
        super();
        this.#client = client;
        this.#numShards = client.numShards;
        this.#identifyInterval = client.identifyInterval;
    }

    start() {
        for (let i = 0; i < this.#numShards; i++) {
            setTimeout(() => {
                const shard = new WebSocketManager(i, this.#client);
                shard.connect();
                this.set(i, shard);
            }, i * this.#identifyInterval);
        }
    }

}

export { ShardManager }