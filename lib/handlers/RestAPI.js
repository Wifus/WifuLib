"use strict";

const {default: nodeFetch} = require("node-fetch");
const {ENDPOINTS} = require("../constants");

module.exports = class RestAPI{

    /**
     * Init the REST API manager
     * @arg {String} token 
     */
    constructor(token) {
        this.headers = {"Content-Type": 'application/json', "Authorization": `Bot ${token}`};
    }

    /**
     * Generalized http request function
     * @arg {{url: String, method?: String}} endpoint 
     * @arg {String} body 
     */
    async fetch({url = null, method = `GET`} = {url: null}, body = null){

        const options = {
            method: method,
            body: body,
            headers: this.headers
        }

        const response = await nodeFetch(url, options);

        try {
            return await response.json();
        } catch (e) {
            return response;
        }
    }

    /**
     * {@link https://discord.com/developers/docs/resources/user#get-user Get User}
     * @arg {String} id 
     * @returns {Promise}
     */
    async getUser(id){
        return await this.fetch(ENDPOINTS.GET_USER(id));
    }

    /**
     * {@link https://discord.com/developers/docs/interactions/slash-commands#create-interaction-response Create Interaction Response}
     * @arg {{id: String, token: String}} interaction 
     * @arg {*} response
     * @returns {Promise}
     */
    async createInteractionResponse(interaction, response){
        return await this.fetch(ENDPOINTS.CREATE_INTERACTION_RESPONSE(interaction.id, interaction.token), JSON.stringify(response));
    }

    /**
     * {@link https://discord.com/developers/docs/interactions/slash-commands#edit-original-interaction-response Edit Original Interaction Response}
     * @arg {String} interaction_token
     * @arg {String} bot_id 
     * @arg {*} response
     * @returns {Promise}
     */
    async editInteractionResponse(bot_id, interaction_token, response){
        return await this.fetch(ENDPOINTS.EDIT_INTERACTION_RESPONSE(bot_id, interaction_token), JSON.stringify(response));
    }

    /**
     * {@link https://discord.com/developers/docs/interactions/slash-commands#delete-original-interaction-response Delete Original Interaction Response}
     * @arg {String} interaction_token
     * @arg {String} bot_id
     * @returns {Promise}
     */
    async deleteInteractionResponse(bot_id, interaction_token){
        return await this.fetch(ENDPOINTS.DELETE_INTERACTION_RESPONSE(bot_id, interaction_token));
    }

    /**
     * {@link https://discord.com/developers/docs/resources/channel#create-message Create Message}
     * @arg {String} channel_id 
     * @arg {*} message
     * @returns {Promise}
     */
    async createMessage(channel_id, message){
        return await this.fetch(ENDPOINTS.CREATE_MESSAGE(channel_id), JSON.stringify(message));
    }

    /**
     * {@link https://discord.com/developers/docs/resources/channel#edit-message Edit Message}
     * @arg {String} channel_id 
     * @arg {String} message_id
     * @arg {*} message
     * @returns {Promise}
     */
    async editMessage(channel_id, message_id, message){
        return await this.fetch(ENDPOINTS.EDIT_MESSAGE(channel_id, message_id), JSON.stringify(message));
    }

    /**
     * {@link https://discord.com/developers/docs/resources/channel#delete-message Delete Message}
     * @arg {String} channel_id 
     * @arg {String} message_id
     * @returns {Promise}
     */
    async deleteMessage(channel_id, message_id){
        return await this.fetch(ENDPOINTS.DELETE_MESSAGE(channel_id, message_id));
    }

    /**
     * {@link https://discord.com/developers/docs/resources/guild#modify-guild-member Modify Guild Member}
     * @arg {String} guild_id 
     * @arg {String} id
     * @arg {*} data
     * @returns {Promise}
     */
    async editMember(guild_id, id, data){
        return await this.fetch(ENDPOINTS.MODIFY_GUILD_MEMBER(guild_id, id), JSON.stringify(data));
    }

}