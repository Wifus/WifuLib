import { Gateway } from "./interfaces/payloads.ts"
import { Events, Handler, ShardManagerOptions, ClientOptions } from "./interfaces/util.ts";

import { DISCORD_API_VERSION } from "./constants.ts";

import { RestAPI } from "./utils/RestAPI.ts";
import { ShardManager } from "./gateway/Shards.ts"

class Client extends RestAPI {

    #token: string;
    #shards: ShardManager;
    #events: Map<Events, Handler>;

    constructor(options: ClientOptions) {
        super(options.token);
        this.#token = options.token;
        this.#shards = new ShardManager(this);
        this.#events = new Map();

        this.login();
    }

    async login() {
        const gateway: Gateway = await this.getGateway();
        const options: ShardManagerOptions = {
            numShards: gateway.shards,
            identifyInterval: gateway.session_start_limit.max_concurrency * 5000,
            wsUrl: `${gateway.url}/?v=${DISCORD_API_VERSION}&encoding=json`
        }
        this.#shards.start(options);
    }

    on(event: Events, callback: Handler) {
        this.#events.set(event, callback);
    }

    emit(event: Events, data?: Handler) {
        const func = this.#events.get(event);
        if (func) func(data);
    }

    get token() { return this.#token }
    get shards() { return this.#shards }

}

export { Client };