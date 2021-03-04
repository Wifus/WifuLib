import { Events, Handler, ShardManagerOptions, ClientOptions } from "./Types.ts";
import { RestAPI } from "./Rest.ts";
import { ShardManager } from "./Gateway.ts"
import { EventHandler } from "./Event.ts";
import { Collection } from "./Collection.ts";
import { User, Guild, Command } from "./Objects.ts";
import { Discord } from "../deps.ts";
import { CommandHandler } from "./Command.ts";

class Client extends RestAPI {

    #token: string;
    #shards: ShardManager;
    #events: Map<Events, Handler>;
    #shardEvents: EventHandler;
    botUser: User | null;
    guilds: Collection<Guild, "id">;
    users: Collection<User, "id">;
    #intents: Discord.GatewayIntentBits[];
    commands: Map<Discord.Snowflake, Command>;
    #commandHandler = new CommandHandler(this);

    constructor(options: ClientOptions) {
        super(options.token);
        this.#token = options.token;
        this.#shards = new ShardManager(this);
        this.#events = new Map();
        this.#shardEvents = new EventHandler(this);
        this.botUser = null;
        this.users = new Collection(User, "id");
        this.guilds = new Collection(Guild, "id");
        this.#intents = options.intents;
        this.commands = new Map();
        this.#commandHandler = new CommandHandler(this);

        this.login();
    }

    private async login() {
        const gateway: Discord.RESTGetAPIGatewayBotResult = await this.getGateway();
        const options: ShardManagerOptions = {
            numShards: gateway.shards,
            identifyInterval: gateway.session_start_limit.max_concurrency * 5000,
            wsUrl: `${gateway.url}/?v=${Discord.APIVersion}&encoding=json`,
            intents: this.#intents.reduce((a, b) => a + b)
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

    addCommand(command: Command) {
        this.commands.set(command.id, command);
    }

    get token() { return this.#token }
    get shards() { return this.#shards }
    get shardEvents() { return this.#shardEvents }
    get commandHandler() { return this.#commandHandler }
    guild(id: Discord.Snowflake) { return this.guilds.get(id) }
    user(id: Discord.Snowflake) { return this.users.get(id) }
    shard(id: number) { return this.#shards.get(id) }

}

export { Client };