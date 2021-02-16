import { OPCODES, PAYLOADS } from "../constants.ts";
import { Base } from "../utils/Base.ts";
import type { Client } from "../client.ts";

class WebSocketManager extends Base{

    #client: Client;
    #token: string;
    #gateway: WebSocket|null;
    #sequence_number: number|null;
    #session_id: string|null;
    #lastHeartbeatACK: boolean;
    #pulse: number|null;
    
    constructor(id: number, client: Client) {
        super(id);
        this.#client = client;
        this.#token = client.token;
        this.#gateway = null;
        this.#sequence_number = null;
        this.#session_id = null;
        this.#lastHeartbeatACK = false;
        this.#pulse = null;
    }

    public connect(){
        this.#gateway = new WebSocket(this.#client.wsURL);
        this.#lastHeartbeatACK = true;
        this.#gateway.onmessage = (payload: MessageEvent) => this.recieve(JSON.parse(payload.data));
        this.#client.emit(`debug`, `Shard ${this.id} Connected`);
    }

    private disconect(reconnect: boolean){
        if(!this.#gateway){return;}

        this.#gateway.close();
        this.#gateway = null;
        this.reset();

        this.#client.emit(`debug`, `Shard ${this.id} Disconnected`);

        if(reconnect){
            this.connect();
        }
    }

    private recieve(payload: any){        
        const {op, d, s} = payload;
        this.#sequence_number = s ?? this.#sequence_number;

        switch(op){
            case OPCODES.DISPATCH:
                console.log(payload.t);
                // this.#client.events.handleDispatch(payload);
                break;
            case OPCODES.HEARTBEAT:
                this.heartbeat();
                break;
            case OPCODES.RECONNECT:
                this.disconect(true);
                break;
            case OPCODES.INVALID_SESSION:
                this.#sequence_number = 0;
                this.#session_id = null;
                this.identify();
                break;
            case OPCODES.HELLO:
                const {heartbeat_interval} = d;
                if(this.#pulse){clearInterval(this.#pulse);}
                this.#pulse = setInterval(() => {this.heartbeat(true)}, heartbeat_interval);

                if(this.#session_id) this.resume();
                else this.identify();
                break;
            case OPCODES.HEARTBEAT_ACKNOWLEDGEMENT:
                this.#lastHeartbeatACK = true;
                break;
            default:
                this.#client.emit(`debug`, `UNKNOWN OPCODE: ${op}`);
                console.log(payload);
                break;
        }
    }

    private heartbeat(pulse = false){
        if(pulse) {
            if(!this.#lastHeartbeatACK){
                this.disconect(true);
            }
            this.#lastHeartbeatACK = false;
        }
        if(this.#gateway&&this.#sequence_number)
        this.#gateway.send(PAYLOADS.HEARTBEAT(this.#sequence_number));
        //Add errors
    }

    private identify(){
        if(this.#gateway)
        this.#gateway.send(PAYLOADS.IDENTIFY(this.#token, 771, this.id, this.#client.numShards));
        //Add errors
    }

    private resume(){
        if(this.#gateway&&this.#session_id&&this.#sequence_number)
        this.#gateway.send(PAYLOADS.RESUME(this.#token, this.#session_id, this.#sequence_number));
        //Add errors
    }

    private reset(){
        if(this.#pulse){
            clearInterval(this.#pulse);
            this.#pulse = null;
        }
        this.#lastHeartbeatACK = false;
    }

    set session_id(session_id: string){this.#session_id = session_id;}
}

export { WebSocketManager };