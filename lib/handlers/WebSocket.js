"use strict";

const WebSocket = require('ws');
const {OPCODES, PAYLOADS, GATEWAY} = require("../constants");

module.exports = class WebSocketManager{
    /**
     * Init the websocket manager
     * @param {import("../client")} client 
     */
    constructor(client){
        /**@private @type {import("../client")} */
        this.client = client;
        /**@private @type {String}*/
        this.token = client.token;
        /**@private @type {WebSocket}*/
        this.gateway = null;
        /**@private @type {Number}*/
        this.sequence_number = null;
        /**@private @type {String}*/
        this._session_id = null;
        /**@private @type {Boolean}*/
        this.lastHeartbeatACK = false;
        /**@private @type {NodeJS.Timeout}*/
        this.pulse = null;
    }

    connect(){
        this.gateway = new WebSocket(GATEWAY(8));
        this.lastHeartbeatACK = true;
        this.gateway.on("message", payload => this.recieve(payload));
        this.client.log(`Connected`);
    }

    /**@private */
    disconect(reconnect){
        if(!this.gateway){return;}

        this.gateway.close();
        this.gateway = null;
        this.reset();

        this.client.log(`Disconnected`);

        if(reconnect){
            this.connect();
        }
    }

    /**@private */
    recieve(payload){
        const pl = JSON.parse(payload)
        const {op, d, s} = pl;
        this.sequence_number = s ?? this.sequence_number;

        switch(op){
            case OPCODES.DISPATCH:
                this.client.events.handleDispatch(pl);
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
                console.log(pl);
                break;
        }
    }

    /**@private */
    heartbeat(pulse){
        if(pulse) {
            if(!this.lastHeartbeatACK){
                this.disconect(true);
            }
            this.lastHeartbeatACK = false;
        }
        this.gateway.send(PAYLOADS.HEARTBEAT(this.sequence_number));
    }

    /**@private */
    identify(){
        this.gateway.send(PAYLOADS.IDENTIFY(this.token, 771));
    }

    /**@private */
    resume(){
        this.gateway.send(PAYLOADS.RESUME(this.token, this._session_id, this.sequence_number));
    }

    /**@private */
    reset(){
        if(this.pulse){
            clearInterval(this.pulse);
            this.pulse = null;
        }
        this.lastHeartbeatACK = false;
    }

    /**@arg {String?} session_id New Session ID */
    set session_id(session_id){this._session_id = session_id;}

}