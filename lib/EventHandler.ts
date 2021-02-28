import type { Client } from "./Client.ts";
import { Payload, Ready, DiscordGuild } from "./interfaces/discord.ts";
import { UserData } from "./interfaces/data.ts"
import { User } from "./Objects.ts";

class EventHandler {

    #client: Client;

    constructor(client: Client) {
        this.#client = client;
    }

    handleDispatch(payload: Payload) {
        const { t, d } = payload;
        console.log(payload.t);

        switch (t) {
            case "READY": {
                const data = <Ready>d;
                this.#client.botUser = new User(<UserData>data.user);
                const [id] = data.shard;
                this.#client.shards.get(id).sessionId = data.session_id;
                break;
            }
            case "GUILD_CREATE": {
                const data = <DiscordGuild>d;
                this.#client.guilds.add(data)
                break;
            }
            case "GUILD_UPDATE": break;
            case "GUILD_DELETE": break;
            case "GUILD_ROLE_CREATE": break;
            case "GUILD_ROLE_UPDATE": break;
            case "GUILD_ROLE_DELETE": break;
            case "GUILD_MEMBER_ADD": break;
            case "GUILD_MEMBER_UPDATE": break;
            case "GUILD_MEMBER_REMOVE": break;
            case "PRESENCE_UPDATE": break;
            case "INTERACTION_CREATE": break;
            default: break;
        }
    }

}

export { EventHandler }