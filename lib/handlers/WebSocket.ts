import { WebSocket } from "https://deno.land/x/websocket@v0.0.6/mod.ts";
import { OPCODES, PAYLOADS, GATEWAY} from "../constants.ts";
import type { Client } from "../client.ts";

class WebSocketManager {

    private client: Client;
    private token: string;
    private gateway: WebSocket|null;
    private sequence_number: number|null;
    private _session_id: string|null;
    private lastHeartbeatACK: boolean;
    private pulse: number|null;
    
    constructor(client: Client) {
        this.client = client;
        this.token = client.token;
        this.gateway = null;
        this.sequence_number = null;
        this._session_id = null;
        this.lastHeartbeatACK = false;
        this.pulse = null;
    }

    public connect(){
        this.gateway = new WebSocket(GATEWAY(8));
        this.lastHeartbeatACK = true;
        this.gateway.on("message", (payload: string) => this.recieve(JSON.parse(payload)));
        this.client.log(`Connected`);
    }

    private disconect(reconnect: boolean){
        if(!this.gateway){return;}

        this.gateway.close();
        this.gateway = null;
        this.reset();

        this.client.log(`Disconnected`);

        if(reconnect){
            this.connect();
        }
    }

    private recieve(payload: any){
        const {op, d, s} = payload;
        this.sequence_number = s ?? this.sequence_number;

        switch(op){
            case OPCODES.DISPATCH:
                // this.client.events.handleDispatch(payload);
                break;
            case OPCODES.HEARTBEAT:
                this.heartbeat();
                break;
            case OPCODES.RECONNECT:
                this.disconect(true);
                break;
            case OPCODES.INVALID_SESSION:
                this.sequence_number = 0;
                this._session_id = null;
                this.identify();
                break;
            case OPCODES.HELLO:
                const {heartbeat_interval} = d;
                if(this.pulse){clearInterval(this.pulse);}
                this.pulse = setInterval(() => {this.heartbeat(true)}, heartbeat_interval);

                if(this._session_id) this.resume();
                else this.identify();
                break;
            case OPCODES.HEARTBEAT_ACKNOWLEDGEMENT:
                this.lastHeartbeatACK = true;
                break;
            default:
                this.client.log(`UNKNOWN OPCODE: ${op}`);
                console.log(payload);
                break;
        }
    }

    private heartbeat(pulse = false){
        if(pulse) {
            if(!this.lastHeartbeatACK){
                this.disconect(true);
            }
            this.lastHeartbeatACK = false;
        }
        if(this.gateway&&this.sequence_number)
        this.gateway.send(PAYLOADS.HEARTBEAT(this.sequence_number));
        //Add errors
    }

    private identify(){
        if(this.gateway)
        this.gateway.send(PAYLOADS.IDENTIFY(this.token, 771));
        //Add errors
    }

    private resume(){
        if(this.gateway&&this._session_id&&this.sequence_number)
        this.gateway.send(PAYLOADS.RESUME(this.token, this._session_id, this.sequence_number));
        //Add errors
    }

    private reset(){
        if(this.pulse){
            clearInterval(this.pulse);
            this.pulse = null;
        }
        this.lastHeartbeatACK = false;
    }

    set session_id(session_id: string){this._session_id = session_id;}
}

export {WebSocketManager};