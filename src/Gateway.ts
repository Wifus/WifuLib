import { ShardManagerOptions, ShardOptions } from "./Types.ts";
import { Discord } from "../deps.ts";
import { Client } from "./Client.ts";

class WebSocketManager extends WebSocket {

    #id: number;
    #client: Client;
    #token: string;
    #numShards: number
    #sequenceNumber: number;
    #sessionId: string;
    #lastHeartbeatACK: boolean;
    #pulse: number;
    #intents: number;

    constructor(options: ShardOptions, client: Client) {
        super(options.wsUrl);
        this.#id = options.id;
        this.#client = client;
        this.#token = client.token;
        this.#numShards = options.numShards;
        this.#sequenceNumber = 0;
        this.#sessionId = "";
        this.#lastHeartbeatACK = false;
        this.#pulse = NaN;
        this.#intents = options.intents;
    }

    public connect() {
        this.#lastHeartbeatACK = true;
        this.onmessage = (payload: MessageEvent) => this.recieve(JSON.parse(payload.data));
        this.#client.emit(`debug`, `Shard ${this.#id} Connected`);
        //Do I need a "shardConnect" event?
    }

    private disconect(reconnect: boolean) {
        this.close();
        this.#client.emit(`debug`, `Shard ${this.#id} Disconnected`);
        // this.#client.emit("shardDisconnect", );
        //Emit some form of "shardDisconnect" event
    }

    private recieve(payload: Discord.GatewayReceivePayload) {
        const { op, s } = payload;
        const { GatewayOPCodes } = Discord;
        this.#sequenceNumber = s ?? this.#sequenceNumber;

        switch (op) {
            case GatewayOPCodes.Dispatch: {
                payload = <Discord.GatewayDispatchPayload>payload;
                this.#client.shardEvents.handleDispatch(payload);
                break;
            }
            case GatewayOPCodes.Heartbeat:
                this.heartbeat();
                break;
            case GatewayOPCodes.Reconnect:
                this.disconect(true);
                break;
            case GatewayOPCodes.InvalidSession:
                this.#sequenceNumber = 0;
                this.#sessionId = "";
                this.identify();
                break;
            case GatewayOPCodes.Hello: {
                const { d } = <Discord.GatewayHello>payload;
                if (this.#pulse) { clearInterval(this.#pulse); }
                this.#pulse = setInterval(() => { this.heartbeat(true) }, d.heartbeat_interval);

                if (this.#sessionId) this.resume();
                else this.identify();
                break;
            }
            case GatewayOPCodes.HeartbeatAck:
                this.#lastHeartbeatACK = true;
                break;
            default:
                this.#client.emit(`debug`, `UNKNOWN OPCODE: ${op}`);
                console.log(payload);
                break;
        }
    }

    private heartbeat(pulse = false) {
        if (pulse) {
            if (!this.#lastHeartbeatACK) {
                this.disconect(true);
            }
            this.#lastHeartbeatACK = false;
        }
        const payload: Discord.GatewayHeartbeat = {
            op: Discord.GatewayOPCodes.Heartbeat,
            d: this.#sequenceNumber
        }
        this.send(JSON.stringify(payload));
    }

    private identify() {
        const payload: Discord.GatewayIdentify = {
            op: Discord.GatewayOPCodes.Identify,
            d: {
                token: this.#token,
                intents: this.#intents,
                properties: {
                    $os: Deno.build.os,
                    $browser: "wifu_library",
                    $device: "wifu_library"
                },
                shard: [this.#id, this.#numShards],
            }
        }
        this.send(JSON.stringify(payload));
    }

    private resume() {
        const payload: Discord.GatewayResume = {
            op: Discord.GatewayOPCodes.Resume,
            d: {
                token: this.#token,
                session_id: this.#sessionId,
                seq: this.#sequenceNumber
            }
        }
        this.send(JSON.stringify(payload));
    }

    set sessionId(sessionId: string) { this.#sessionId = sessionId; }
}

//Needs to manage shards that need to reconnect
//Then make sure that reconnects are only attempted once per the identify interval
class ShardManager extends Map {

    #client: Client;

    constructor(client: Client) {
        super();
        this.#client = client;
    }

    get(id: number): WebSocketManager {
        return super.get(id);
    }

    start(options: ShardManagerOptions) {
        for (let i = 0; i < options.numShards; i++) {
            setTimeout(() => {
                const shardOptions: ShardOptions = { id: i, ...options };
                const shard = new WebSocketManager(shardOptions, this.#client);
                shard.connect();
                this.set(i, shard);
            }, i * options.identifyInterval);
        }
    }

}

export { ShardManager };