import { Events, Handler, ShardManagerOptions, ClientOptions, Discord } from "./Types.ts"
import Collection from "./Objects/Collection.ts"
import User from "./Objects/User.ts"
import Guild from "./Objects/Guild.ts"
import Command from "./Objects/Command.ts"
import InteractionResponse from "./Objects/InteractionResponse.ts"
import CommandHandler  from "./Util/Commands.ts"
import EventHandler from "./Util/Events.ts"
import ShardManager from "./Util/Gateway.ts"
import Reply from "./Builders/Reply.ts"

class Client {

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
    #headers: { "Content-Type": string, "Authorization": string };
    #urlBase: string;

    constructor(options: ClientOptions) {
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
        this.#headers = { "Content-Type": 'application/json', "Authorization": `Bot ${options.token}` };
        this.#urlBase = `https://discord.com/api/v${Discord.APIVersion}`;

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

    private async request(route: string, method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", body?: string) {

        const options = {
            method: method,
            body: body,
            headers: this.#headers
        }

        const response = await fetch(`${this.#urlBase}${route}`, options);

        try {
            return await response.json();
        } catch (e) {
            return response;
        }
    }

    async getGateway() {
        return await this.request(Discord.Routes.gatewayBot());
    }

    async getUser(id: string) {
        return await this.request(Discord.Routes.user(id));
    }

    async createInteractionResponse(interaction: Discord.APIInteraction, response: Reply): Promise<InteractionResponse> {
        await this.request(Discord.Routes.interactionCallback(interaction.id, interaction.token), "POST", response.get());
        return new InteractionResponse(interaction, this.botUser!.id, this, response);
    }

    async editInteractionResponse(botId: Discord.Snowflake, interactionToken: string, response: Reply) {
        await this.request(Discord.Routes.webhookMessage(botId, interactionToken), "PATCH", response.getEdit());
    }

    async deleteInteractionResponse(botId: Discord.Snowflake, interactionToken: string) {
        return await this.request(Discord.Routes.webhookMessage(botId, interactionToken), "DELETE");
    }

    async createMessage(channelId: Discord.Snowflake, message: Discord.RESTPostAPIChannelMessageJSONBody) {
        return await this.request(Discord.Routes.channelMessages(channelId), "POST", JSON.stringify(message));
    }

    async editMessage(channelId: Discord.Snowflake, messageId: Discord.Snowflake, message: Discord.RESTPatchAPIChannelMessageJSONBody) {
        return await this.request(Discord.Routes.channelMessage(channelId, messageId), "PATCH", JSON.stringify(message));
    }

    async deleteMessage(channelId: Discord.Snowflake, messageId: Discord.Snowflake) {
        return await this.request(Discord.Routes.channelMessage(channelId, messageId), "DELETE");
    }

    async editMember(guildId: Discord.Snowflake, id: Discord.Snowflake, data: Discord.RESTPatchAPIGuildMemberJSONBody) {
        return await this.request(Discord.Routes.guildMember(guildId, id), "PATCH", JSON.stringify(data));
    }

}

export default Client