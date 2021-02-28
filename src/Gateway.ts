import { ShardManagerOptions, ShardOptions } from "./interfaces/client.ts";
import { Payload, Hello } from "./interfaces/discord.ts";
import { OPCODES, PAYLOADS } from "./Constants.ts";
import type { Client } from "./Client.ts";

class WebSocketManager extends WebSocket {

    #id: number;
    #client: Client;
    #token: string;
    #numShards: number
    #sequenceNumber: number;
    #sessionId: string;
    #lastHeartbeatACK: boolean;
    #pulse: number;

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

    private recieve(payload: Payload) {
        const { op, d, s } = payload;
        this.#sequenceNumber = s ?? this.#sequenceNumber;

        switch (op) {
            case OPCODES.DISPATCH:
                this.#client.shardEvents.handleDispatch(payload);
                break;
            case OPCODES.HEARTBEAT:
                this.heartbeat();
                break;
            case OPCODES.RECONNECT:
                this.disconect(true);
                break;
            case OPCODES.INVALID_SESSION:
                this.#sequenceNumber = 0;
                this.#sessionId = "";
                this.identify();
                break;
            case OPCODES.HELLO: {
                const data = <Hello>d;
                if (this.#pulse) { clearInterval(this.#pulse); }
                this.#pulse = setInterval(() => { this.heartbeat(true) }, data.heartbeat_interval);

                if (this.#sessionId) this.resume();
                else this.identify();
                break;
            }
            case OPCODES.HEARTBEAT_ACKNOWLEDGEMENT:
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
        this.send(PAYLOADS.HEARTBEAT(this.#sequenceNumber));
    }

    private identify() {
        this.send(PAYLOADS.IDENTIFY(this.#token, 771, this.#id, this.#numShards));
    }

    private resume() {
        this.send(PAYLOADS.RESUME(this.#token, this.#sessionId, this.#sequenceNumber));
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