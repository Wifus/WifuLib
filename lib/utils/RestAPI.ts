import { ENDPOINTS } from "../constants.ts";

class RestAPI{

    #headers: any;

    constructor(token: string) {
        this.#headers = {"Content-Type": 'application/json', "Authorization": `Bot ${token}`};
    }

    private async fetch({url, method = `GET`}: {url: string, method?: string}, body?: string){

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

    async getGateway(){
        return await this.fetch(ENDPOINTS.GET_GATEWAY_BOT());
    }

    async getUser(id: string){
        return await this.fetch(ENDPOINTS.GET_USER(id));
    }

    async createInteractionResponse(interaction: any, response: any){
        return await this.fetch(ENDPOINTS.CREATE_INTERACTION_RESPONSE(interaction.id, interaction.token), JSON.stringify(response));
    }

    async editInteractionResponse(bot_id: string, interaction_token: string, response: any){
        return await this.fetch(ENDPOINTS.EDIT_INTERACTION_RESPONSE(bot_id, interaction_token), JSON.stringify(response));
    }

    async deleteInteractionResponse(bot_id: string, interaction_token: string){
        return await this.fetch(ENDPOINTS.DELETE_INTERACTION_RESPONSE(bot_id, interaction_token));
    }

    async createMessage(channel_id: string, message: any){
        return await this.fetch(ENDPOINTS.CREATE_MESSAGE(channel_id), JSON.stringify(message));
    }

    async editMessage(channel_id: string, message_id: string, message: any){
        return await this.fetch(ENDPOINTS.EDIT_MESSAGE(channel_id, message_id), JSON.stringify(message));
    }

    async deleteMessage(channel_id: string, message_id: string){
        return await this.fetch(ENDPOINTS.DELETE_MESSAGE(channel_id, message_id));
    }

    async editMember(guild_id: string, id: string, data: any){
        return await this.fetch(ENDPOINTS.MODIFY_GUILD_MEMBER(guild_id, id), JSON.stringify(data));
    }

}

export { RestAPI } 