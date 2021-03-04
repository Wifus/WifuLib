import { Discord } from "../deps.ts";

class RestAPI {

    #headers: { "Content-Type": string, "Authorization": string };
    #urlBase: string;

    constructor(token: string) {
        this.#headers = { "Content-Type": 'application/json', "Authorization": `Bot ${token}` };
        this.#urlBase = `https://discord.com/api/v${Discord.APIVersion}`;
    }

    private async fetch(route: string, method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", body?: string) {

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
        return await this.fetch(Discord.Routes.gatewayBot());
    }

    async getUser(id: string) {
        return await this.fetch(Discord.Routes.user(id));
    }

    async createInteractionResponse(interaction: Discord.APIInteraction, response: Discord.RESTPostAPIInteractionCallbackJSONBody) {
        return await this.fetch(Discord.Routes.interactionCallback(interaction.id, interaction.token), "POST", JSON.stringify(response));
    }

    async editInteractionResponse(botId: Discord.Snowflake, interactionToken: string, response: Discord.RESTPatchAPIWebhookWithTokenMessageJSONBody) {
        return await this.fetch(Discord.Routes.webhookMessage(botId, interactionToken), "PATCH", JSON.stringify(response));
    }

    async deleteInteractionResponse(botId: Discord.Snowflake, interactionToken: string) {
        return await this.fetch(Discord.Routes.webhookMessage(botId, interactionToken), "DELETE");
    }

    async createMessage(channelId: Discord.Snowflake, message: Discord.RESTPostAPIChannelMessageJSONBody) {
        return await this.fetch(Discord.Routes.channelMessages(channelId), "POST", JSON.stringify(message));
    }

    async editMessage(channelId: Discord.Snowflake, messageId: Discord.Snowflake, message: Discord.RESTPatchAPIChannelMessageJSONBody) {
        return await this.fetch(Discord.Routes.channelMessage(channelId, messageId), "PATCH", JSON.stringify(message));
    }

    async deleteMessage(channelId: Discord.Snowflake, messageId: Discord.Snowflake) {
        return await this.fetch(Discord.Routes.channelMessage(channelId, messageId), "DELETE");
    }

    async editMember(guildId: Discord.Snowflake, id: Discord.Snowflake, data: Discord.RESTPatchAPIGuildMemberJSONBody) {
        return await this.fetch(Discord.Routes.guildMember(guildId, id), "PATCH", JSON.stringify(data));
    }

}

export { RestAPI } 