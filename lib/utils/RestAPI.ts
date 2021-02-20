import { ENDPOINTS } from "../constants.ts";

class RestAPI {

    #headers: { "Content-Type": string, "Authorization": string };

    constructor(token: string) {
        this.#headers = { "Content-Type": 'application/json', "Authorization": `Bot ${token}` };
    }

    private async fetch({ url, method = `GET` }: { url: string, method?: string }, body?: string) {

        const options = {
            method: method,
            body: body,
            headers: this.#headers
        }

        const response = await fetch(url, options);

        try {
            return await response.json();
        } catch (e) {
            return response;
        }
    }

    async getGateway() {
        return await this.fetch(ENDPOINTS.GET_GATEWAY_BOT());
    }

    async getUser(id: string) {
        return await this.fetch(ENDPOINTS.GET_USER(id));
    }

    async createInteractionResponse(interactionId: string, interactionToken: string, response: unknown) {
        return await this.fetch(ENDPOINTS.CREATE_INTERACTION_RESPONSE(interactionId, interactionToken), JSON.stringify(response));
    }

    async editInteractionResponse(botId: string, interactionToken: string, response: unknown) {
        return await this.fetch(ENDPOINTS.EDIT_INTERACTION_RESPONSE(botId, interactionToken), JSON.stringify(response));
    }

    async deleteInteractionResponse(botId: string, interactionToken: string) {
        return await this.fetch(ENDPOINTS.DELETE_INTERACTION_RESPONSE(botId, interactionToken));
    }

    async createMessage(channelId: string, message: unknown) {
        return await this.fetch(ENDPOINTS.CREATE_MESSAGE(channelId), JSON.stringify(message));
    }

    async editMessage(channelId: string, messageId: string, message: unknown) {
        return await this.fetch(ENDPOINTS.EDIT_MESSAGE(channelId, messageId), JSON.stringify(message));
    }

    async deleteMessage(channelId: string, messageId: string) {
        return await this.fetch(ENDPOINTS.DELETE_MESSAGE(channelId, messageId));
    }

    async editMember(guildId: string, id: string, data: unknown) {
        return await this.fetch(ENDPOINTS.MODIFY_GUILD_MEMBER(guildId, id), JSON.stringify(data));
    }

}

export { RestAPI } 