import { Discord } from "../Types.ts"
import Embed from "./Embed.ts"

class Reply {

    #type: Discord.APIInteractionResponseType;
    #message?: string;
    #ephemeral: boolean;
    #embed?: Discord.APIEmbed;

    constructor(message?: string) {
        this.#type = message ? 4 : 2;
        this.#message = message;
        this.#ephemeral = false;
    }

    ephemeral() { this.#ephemeral = !this.#ephemeral; return this; }

    embed(embed: Embed) { this.#embed = embed.get(); return this; }

    content(message: string) { this.#message = message; return this; }

    get() {
        const data = {
            type: this.#type,
            data: {
                content: this.#message,
                embeds: this.#embed ? [this.#embed] : [],
                flags: this.#ephemeral ? 1 << 6 : 0
            }
        }
        return JSON.stringify(data);
    }

    getEdit() {
        const data: Discord.RESTPostAPIWebhookWithTokenJSONBody = {
            content: this.#message,
            embeds: this.#embed ? [this.#embed] : []
        }
        return JSON.stringify(data);
    }

}

export default Reply
