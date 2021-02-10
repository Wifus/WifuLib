"use strict";

/**
 * Enum for Gateway opcodes
 * @readonly
 * @enum {Number}
 */
const OPCODES = {
    /**@readonly */    
    DISPATCH: 0,                    //Receive
    /**@readonly */
    HEARTBEAT: 1,                   //Send & Receive
    /**@readonly */
    IDENTIFY: 2,                    //Send
    /**@readonly */
    PRESENCE_UPDATE: 3,             //Send
    /**@readonly */
    VOICE_STATE_UPDATE: 4,          //Send
    /**@readonly */
    RESUME: 6,                      //Send
    /**@readonly */
    RECONNECT: 7,                   //Receive
    /**@readonly */
    REQUEST_GUILD_MEMBERS: 8,       //Send
    /**@readonly */
    INVALID_SESSION: 9,             //Receive
    /**@readonly */
    HELLO: 10,                      //Receive
    /**@readonly */
    HEARTBEAT_ACKNOWLEDGEMENT: 11   //Receive
}

/**
 * Enum for Gateway payloads
 * @readonly
 * @enum {(arg0, arg1?, arg2?) => String}
 */
const PAYLOADS = {
    /**
     * @readonly 
     * {@link https://discord.com/developers/docs/topics/gateway#heartbeat Heartbeat}
     * @arg {Number} sequence_number 
     * @returns {String}
     */
    HEARTBEAT: (sequence_number) => {
        return JSON.stringify({
            op: OPCODES.HEARTBEAT, 
            d: sequence_number
        })
    },
    /**
     * @readonly 
     * {@link https://discord.com/developers/docs/topics/gateway#identify Identify}
     * @arg {String} token
     * @arg {Number} intents
     * @returns {String}
     */
    IDENTIFY: (token, intents) => {
        return JSON.stringify({
            op: OPCODES.IDENTIFY, 
            d: {
                token: token,
                intents: intents,
                properties: {
                    $os: process.platform,
                    $browser: "Wifu",
                    $device: "Wifu"
                }
            }
        })
    },
    /**
     * @readonly
     * {@link https://discord.com/developers/docs/topics/gateway#resume Resume}
     * @arg {String} token
     * @arg {String} session_id
     * @arg {Number} sequence_number
     * @returns {String}
     */
    RESUME: (token, session_id, sequence_number) => {
        return JSON.stringify({
            op: OPCODES.RESUME,
            d: {
                token: token,
                session_id: session_id,
                seq: sequence_number
            }
        })
    }
}

/**
 * Function to get Websocket Gateway link
 * @readonly
 * {@link https://discord.com/developers/docs/topics/gateway#connecting-to-the-gateway Connecting to the Gateway}
 * @arg {number} v Gateway version
 * @returns {String} Websocket Gateway link
 */
const GATEWAY = (v = 8) => `wss://gateway.discord.gg/?v=${v}&encoding=json`;

/**
 * Function to get REST api link
 * @readonly
 * {@link https://discord.com/developers/docs/reference#api-versioning API Versioning}
 * @arg {number} v REST api version
 * @returns {String} REST api link
 */
const REST_API = (v = 8) => `https://discord.com/api/v${v}`;

/**
 * Enum for Gateway payloads
 * @readonly
 * @enum {(arg0: string, arg1?: string) => {url: String, method?: String}}
 */
const ENDPOINTS = {
    /**
     * @readonly
     * {@link https://discord.com/developers/docs/resources/user#get-user Get User}
     * @arg {String} id
     * @returns {{url: String}}
     */
    GET_USER: (id) => {
        return {
            url: `${REST_API()}/users/${id}`,
        }
    },
    /**
     * @readonly
     * {@link https://discord.com/developers/docs/resources/guild#get-guild-member Get Guild Member}
     * @arg {String} guild_id 
     * @arg {String} id
     * @returns {{url: String}} 
     */
    GET_GUILD_MEMBER: (guild_id, id) => {
        return {
            url: `${REST_API()}/guilds/${guild_id}/members/${id}`
        }
    },
    /**
     * @readonly
     * {@link https://discord.com/developers/docs/interactions/slash-commands#create-interaction-response Create Interaction Response}
     * @arg {String} interaction_id 
     * @arg {String} interaction_token
     * @returns {{url: String, method: String}} 
     */
    CREATE_INTERACTION_RESPONSE: (interaction_id, interaction_token) => {
        return {
            url: `${REST_API()}/interactions/${interaction_id}/${interaction_token}/callback`,
            method: `POST`
        }
    },
    /**
     * @readonly
     * {@link https://discord.com/developers/docs/interactions/slash-commands#edit-original-interaction-response Edit Original Interaction Response}
     * @arg {String} bot_id 
     * @arg {String} interaction_token
     * @returns {{url: String, method: String}} 
     */
    EDIT_INTERACTION_RESPONSE: (bot_id, interaction_token) => {
        return {
            url: `${REST_API()}/webhooks/${bot_id}/${interaction_token}/messages/@original`,
            method: `PATCH`
        }
    },
    /**
     * @readonly
     * {@link https://discord.com/developers/docs/interactions/slash-commands#delete-original-interaction-response Delete Original Interaction Response}
     * @arg {String} bot_id 
     * @arg {String} interaction_token
     * @returns {{url: String, method: String}} 
     */
    DELETE_INTERACTION_RESPONSE: (bot_id, interaction_token) => {
        return {
            url: `${REST_API()}/webhooks/${bot_id}/${interaction_token}/messages/@original`,
            method: `DELETE`
        }
    },
    /**
     * @readonly
     * {@link https://discord.com/developers/docs/resources/channel#create-message Create Message}
     * @arg {String} channel_id
     * @returns {{url: String, method: String}}
     */
    CREATE_MESSAGE: (channel_id) => {
        return {
            url: `${REST_API()}/channels/${channel_id}/messages`,
            method: `POST`
        }
    },
    /**
     * @readonly
     * {@link https://discord.com/developers/docs/resources/channel#edit-message Edit Message}
     * @arg {String} channel_id 
     * @arg {String} message_id
     * @returns {{url: String, method: String}}
     */
    EDIT_MESSAGE: (channel_id, message_id) => {
        return {
            url: `${REST_API()}/channels/${channel_id}/messages/${message_id}`,
            method: `PATCH`
        }
    },
    /**
     * @readonly
     * {@link https://discord.com/developers/docs/resources/channel#delete-message Delete Message}
     * @arg {String} channel_id 
     * @arg {String} message_id
     * @returns {{url: String, method: String}}
     */
    DELETE_MESSAGE: (channel_id, message_id) => {
        return {
            url: `${REST_API()}/channels/${channel_id}/messages/${message_id}`,
            method: `DELETE`
        }
    },
    /**
     * @readonly
     * {@link https://discord.com/developers/docs/resources/guild#modify-guild-member Modify Guild Member}
     * @arg {String} guild_id 
     * @arg {String} id
     * @returns {{url: String, method: String}} 
     */
    MODIFY_GUILD_MEMBER: (guild_id, id) => {
        return {
            url: `${REST_API()}/guilds/${guild_id}/members/${id}`,
            method: `PATCH`
        }
    }
}

/**
 * Enum for Gateway intents
 * @readonly
 * @enum {Number}
 */
const INTENTS =  {
    /**@readonly */    
    GUILDS: 1 << 0,
    /**@readonly */ 
    GUILD_MEMBERS: 1 << 1,
    /**@readonly */ 
    GUILD_BANS: 1 << 2,
    /**@readonly */ 
    GUILD_EMOJIS: 1 << 3,
    /**@readonly */ 
    GUILD_INTEGRATIONS: 1 << 4,
    /**@readonly */ 
    GUILD_WEBHOOKS: 1 << 5,
    /**@readonly */ 
    GUILD_INVITES: 1 << 6,
    /**@readonly */ 
    GUILD_VOICE_STATES: 1 << 7,
    /**@readonly */ 
    GUILD_PRESENCES: 1 << 8,
    /**@readonly */ 
    GUILD_MESSAGES: 1 << 9,
    /**@readonly */ 
    GUILD_MESSAGE_REACTIONS: 1 << 10,
    /**@readonly */ 
    GUILD_MESSAGE_TYPING: 1 << 11,
    /**@readonly */ 
    DIRECT_MESSAGES: 1 << 12,
    /**@readonly */ 
    DIRECT_MESSAGE_REACTIONS: 1 << 13,
    /**@readonly */ 
    DIRECT_MESSAGE_TYPING: 1 << 14
}

module.exports = {
    OPCODES,
    PAYLOADS,
    GATEWAY,
    ENDPOINTS,
    INTENTS
}