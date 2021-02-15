import { WebSocketManager as Gateway } from "./handlers/WebSocket.ts";
import { EventHandler as Events } from "./handlers/Event.ts";

import { Collection } from "./util/Collection.ts";
import { User } from "./objects/User.ts";
import { Guild } from "./objects/Guild.ts";

class Client {

    private _token: string;
    private _gateway: Gateway;
    private _events: Events;

    public guilds: Collection;
    public users: Collection;

    constructor(token: string){
        this._token = token;
        this._gateway = new Gateway(this);
        this._events = new Events(this);

        this.users = new Collection(User);
        this.guilds = new Collection(Guild);

        this.login();
    }

    private login(){this.gateway.connect();}

    log(message: string){
        const now = new Date().toLocaleTimeString("it-IT");
        console.log(`[${now}] ${message}`);
    }

    guild(id: string): Guild {return this.guilds.get(id)}
    user(id: string): User {return this.users.get(id)}

    get token(){return this._token}
    get gateway(){return this._gateway;}
    get events(){return this._events;}

}

export { Client };