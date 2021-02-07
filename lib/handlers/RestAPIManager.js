const nodeFetch = require("node-fetch");
const {ENDPOINTS} = require("../constants");

/**
 * Manages requests to Discord's REST API
 * @prop {Object} headers  Default request headers
 */
class RestAPIManager{

    constructor(token) {
        this.headers = {"Content-Type": 'application/json', "Authorization": `Bot ${token}`};
    }

    /**
     * Fetch function with some defaults
     * @param {Object} endpoint 
     * @param {String} endpoint.method Request method (POST, GET, DELETE, PATCH, etc.)
     * @param {String} endpoint.url Request URL
     * @param {Object} body 
     * @returns {Promise<Object>}
     */
    async fetch(endpoint, body){

        let options = {
            method: endpoint.method ? endpoint.method : `GET`,
            body: body ? body : null,
            headers: this.headers
        }

        let response = await nodeFetch(endpoint.url, options);

        try {
            return await response.json();
        } catch (e) {
            return response;
        }
    }

    /**
     * Get a User's data
     * @param {String} id User's id
     */
    async getUser(id){
        return await this.fetch(ENDPOINTS.GET_USER(id));
    }

    /**
     * Create an interaction response
     * @param {Object} interaction 
     * @param {Object} response 
     */
    async createInteractionResponse(interaction, response){
        return await this.fetch(ENDPOINTS.CREATE_INTERACTION_RESPONSE(interaction.id, interaction.token), JSON.stringify(response));
    }

    /**
     * Creates a message as the bot user
     * @param {String} channel_id 
     * @param {Object} message 
     */
    async createMessage(channel_id, message){
        return await this.fetch(ENDPOINTS.CREATE_MESSAGE(channel_id), JSON.stringify(message));
    }

    /**
     * Deletes a message as the bot user
     * @param {String} channel_id 
     * @param {String} message_id 
     */
    async deleteMessage(channel_id, message_id){
        return await this.fetch(ENDPOINTS.DELETE_MESSAGE(channel_id, message_id));
    }

    /**
     * Edits a message sent by the bot user
     * @param {String} channel_id 
     * @param {String} message_id 
     * @param {Object} message 
     */
    async editMessage(channel_id, message_id, message){
        return await this.fetch(ENDPOINTS.EDIT_MESSAGE(channel_id, message_id), JSON.stringify(message));
    }

}

module.exports = RestAPIManager;