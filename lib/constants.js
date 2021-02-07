/**
 * Enum for payload opcodes
 * @readonly
 * @enum {Number}
 */
const OPCODES = {
    DISPATCH: 0,                    //Receive
    HEARTBEAT: 1,                   //Send & Receive
    IDENTIFY: 2,                    //Send
    PRESENCE_UPDATE: 3,             //Send
    VOICE_STATE_UPDATE: 4,          //Send
    RESUME: 6,                      //Send
    RECONNECT: 7,                   //Receive
    REQUEST_GUILD_MEMBERS: 8,       //Send
    INVALID_SESSION: 9,             //Receive
    HELLO: 10,                      //Receive
    HEARTBEAT_ACKNOWLEDGEMENT: 11   //Receive
}

/**
 * Enum for payloads
 * @readonly
 * @enum {String}
 */
const PAYLOADS = {
    HEARTBEAT: (sequence_number) => {
        return JSON.stringify({
            op: OPCODES.HEARTBEAT, 
            d: sequence_number
        })
    },
    IDENTIFY: (token) => {
        return JSON.stringify({
            op: OPCODES.IDENTIFY, 
            d: {
                token: token,
                intents: 
                (1 << 0) +  //GUILDS
                (1 << 1) +  //GUILD_MEMBERS
                // (1 << 2) +  //GUILD_BANS
                // (1 << 3) +  //GUILD_EMOJIS
                // (1 << 4) +  //GUILD_INTEGRATIONS
                // (1 << 5) +  //GUILD_WEBHOOKS 
                // (1 << 6) +  //GUILD_INVITES
                // (1 << 7) +  //GUILD_VOICE_STATES
                (1 << 8) +  //GUILD_PRESENCES
                (1 << 9) +  //GUILD_MESSAGES
                // (1 << 10) + //GUILD_MESSAGE_REACTIONS
                // (1 << 11) + //GUILD_MESSAGE_TYPING
                // (1 << 12) + //DIRECT_MESSAGES
                // (1 << 13) + //DIRECT_MESSAGE_REACTIONS
                // (1 << 14) + //DIRECT_MESSAGE_TYPING
                0,
                properties: {
                    $os: process.platform,
                    $browser: "wifu_library",
                    $device: "wifu_library"
                }
            }
        })
    },
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
 * Gateway WebSocket URL
 * @readonly
 */
const GATEWAY = "wss://gateway.discord.gg/?v=8&encoding=json"

/**
 * Discord REST API URL
 * @readonly
 */
const REST_API = "https://discord.com/api/v8";

/**
 * Enum for Endpoints/Methods
 * @readonly
 * @enum {Object}
 */
const ENDPOINTS = {
    GET_USER: (id) => {
        return {
            url: `${REST_API}/users/${id}`,
        }
    },
    GET_GUILD_MEMBER: (guild_id, id) => {
        return {
            url: `${REST_API}/guilds/${guild_id}/members/${id}`
        }
    },
    CREATE_INTERACTION_RESPONSE: (interaction_id, interaction_token) => {
        return {
            url: `${REST_API}/interactions/${interaction_id}/${interaction_token}/callback`,
            method: `POST`
        }
    },
    CREATE_MESSAGE: (channel_id) => {
        return {
            url: `${REST_API}/channels/${channel_id}/messages`,
            method: `POST`
        }
    },
    DELETE_MESSAGE: (channel_id, message_id) => {
        return {
            url: `${REST_API}/channels/${channel_id}/messages/${message_id}`,
            method: `DELETE`
        }
    },
    EDIT_MESSAGE: (channel_id, message_id) => {
        return {
            url: `${REST_API}/channels/${channel_id}/messages/${message_id}`,
            method: `PATCH`
        }
    }
}

module.exports = {
    OPCODES,
    PAYLOADS,
    GATEWAY,
    ENDPOINTS
}