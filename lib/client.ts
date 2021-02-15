import { WebSocketManager as Gateway } from "./handlers/WebSocket.ts";
import { EventHandler as Events } from "./handlers/Event.ts";

import { Collection } from "./util/Collection.ts";
import { User } from "./objects/User.ts";
import { Guild } from "./objects/Guild.ts";

class Client {

    #token: string;
    #gateway: Gateway;
    #events: Events;

    guilds: Collection;
    users: Collection;

    constructor(token: string){
        this.#token = token;
        this.#gateway = new Gateway(this);
        this.#events = new Events(this);

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

    get token(){return this.#token}
    get gateway(){return this.#gateway;}
    get events(){return this.#events;}

}

export { Client };