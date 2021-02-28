const DISCORD_API_VERSION = 8;

enum OPCODES {
    DISPATCH = 0,                    //Receive
    HEARTBEAT = 1,                   //Send & Receive
    IDENTIFY = 2,                    //Send
    PRESENCE_UPDATE = 3,             //Send
    VOICE_STATE_UPDATE = 4,          //Send
    RESUME = 6,                      //Send
    RECONNECT = 7,                   //Receive
    REQUEST_GUILD_MEMBERS = 8,       //Send
    INVALID_SESSION = 9,             //Receive
    HELLO = 10,                      //Receive
    HEARTBEAT_ACKNOWLEDGEMENT = 11   //Receive
}

class PAYLOADS {
    static readonly HEARTBEAT = (sequence_number: number): string => {
        return JSON.stringify({
            op: OPCODES.HEARTBEAT, 
            d: sequence_number
        })
    };
    static readonly IDENTIFY = (token: string, intents: number, shardId: number, numShard: number): string => {
        return JSON.stringify({
            op: OPCODES.IDENTIFY, 
            d: {
                token: token,
                intents: intents,
                properties: {
                    $os: Deno.build.os,
                    $browser: "wifu_library",
                    $device: "wifu_library"
                },
                shard: [shardId, numShard],
            }
        })
    };
    static readonly RESUME = (token: string, session_id: string, sequence_number: number): string => {
        return JSON.stringify({
            op: OPCODES.RESUME,
            d: {
                token: token,
                session_id: session_id,
                seq: sequence_number
            }
        })
    };
}

const REST_API = `https://discord.com/api/v${DISCORD_API_VERSION}`;

class ENDPOINTS {
    static readonly GET_GATEWAY_BOT = () => {
        return {
            url: `${REST_API}/gateway/bot`,
        }
    };
    static readonly GET_USER = (id: string) => {
        return {
            url: `${REST_API}/users/${id}`,
        }
    };
    static readonly GET_GUILD_MEMBER = (guild_id: string, id: string) => {
        return {
            url: `${REST_API}/guilds/${guild_id}/members/${id}`
        }
    };
    static readonly CREATE_INTERACTION_RESPONSE = (interaction_id: string, interaction_token: string) => {
        return {
            url: `${REST_API}/interactions/${interaction_id}/${interaction_token}/callback`,
            method: `POST`
        }
    };
    static readonly EDIT_INTERACTION_RESPONSE = (bot_id: string, interaction_token: string) => {
        return {
            url: `${REST_API}/webhooks/${bot_id}/${interaction_token}/messages/@original`,
            method: `PATCH`
        }
    };
    static readonly DELETE_INTERACTION_RESPONSE = (bot_id: string, interaction_token: string) => {
        return {
            url: `${REST_API}/webhooks/${bot_id}/${interaction_token}/messages/@original`,
            method: `DELETE`
        }
    };
    static readonly CREATE_MESSAGE = (channel_id: string) => {
        return {
            url: `${REST_API}/channels/${channel_id}/messages`,
            method: `POST`
        }
    };
    static readonly EDIT_MESSAGE = (channel_id: string, message_id: string) => {
        return {
            url: `${REST_API}/channels/${channel_id}/messages/${message_id}`,
            method: `PATCH`
        }
    };
    static readonly DELETE_MESSAGE = (channel_id: string, message_id: string) => {
        return {
            url: `${REST_API}/channels/${channel_id}/messages/${message_id}`,
            method: `DELETE`
        }
    };
    static readonly MODIFY_GUILD_MEMBER = (guild_id: string, id: string) => {
        return {
            url: `${REST_API}/guilds/${guild_id}/members/${id}`,
            method: `PATCH`
        }
    }
}


export {
    DISCORD_API_VERSION,
    OPCODES,
    PAYLOADS,
    ENDPOINTS
}