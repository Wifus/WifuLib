import { WebSocketManager as Gateway } from "./handlers/WebSocket.ts";

class Client {

    private _token: string;
    private _gateway: Gateway;

    constructor(token: string){
        this._token = token;
        this._gateway = new Gateway(this);

        this.login();
    }

    private login(){this.gateway.connect();}

    public log(message: string){
        const now = new Date().toLocaleTimeString("it-IT");
        console.log(`[${now}] ${message}`);
    }

    get token(){return this._token}
    get gateway(){return this._gateway;}
}

export {Client};