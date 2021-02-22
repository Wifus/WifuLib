import { DiscordGateway } from "./interfaces/discord.ts"
import { Events, Handler, ShardManagerOptions, ClientOptions } from "./interfaces/client.ts";
import { DISCORD_API_VERSION } from "./constants.ts";
import { RestAPI } from "./util/RestAPI.ts";
import { ShardManager } from "./gateway/Shards.ts"
import { EventHandler } from "./util/EventHandler.ts";

class Client extends RestAPI {

    #token: string;
    #shards: ShardManager;
    #events: Map<Events, Handler>;
    #shardEvents: EventHandler;

    constructor(options: ClientOptions) {
        super(options.token);
        this.#token = options.token;
        this.#shards = new ShardManager(this);
        this.#events = new Map();
        this.#shardEvents = new EventHandler(this);

        this.login();
    }

    async login() {
        const gateway: DiscordGateway = await this.getGateway();
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

    emit(event: Events, data?: unknown) {
        const func = this.#events.get(event);
        if (func) func(data);
    }

    get token() { return this.#token }
    get shards() { return this.#shards }
    get shardEvents() { return this.#shardEvents }

}

export { Client };