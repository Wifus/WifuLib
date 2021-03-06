import Base from "./Base.ts"
import { Discord, Client } from "../Types.ts"
import Reply from "../Builders/Reply.ts"

class InteractionResponse extends Base {

    #client: Client
    #botId: Discord.Snowflake;
    #token: string
    #reply: Reply

    constructor(interaction: Discord.APIInteraction, botId: Discord.Snowflake, client: Client, reply: Reply) {
        super(interaction.id);
        this.#token = interaction.token;
        this.#botId = botId;
        this.#client = client;
        this.#reply = reply;
    }

    delete(timeout = 0) {
        setTimeout(async () => {
            await this.#client.deleteInteractionResponse(this.#botId, this.#token);
        }, timeout);
    }

    ephemeral() { this.#reply.ephemeral(); return this; }

    embed(embed: Discord.APIEmbed) { this.#reply.embed(embed); return this; }

    content(message: string) { this.#reply.content(message); return this; }

    async edit() {
        await this.#client.editInteractionResponse(this.#botId, this.#token, this.#reply);
        return this;
    }
}

export default InteractionResponse