import { ClientOptions, Gateway } from "./interfaces.ts";
import { DISCORD_API_VERSION } from "./constants.ts";

import { RestAPI } from "./utils/RestAPI.ts";
import { ShardManager } from "./gateway/Shards.ts"

class Client extends RestAPI{

    #token: string;
    #wsURL: string;
    #numShards: number;
    #identifyInterval: number; //In ms

    #shards: ShardManager;
    #events: Map<string, Function>;

    constructor(options: ClientOptions){
        super(options.token);
        this.#token = options.token;
        this.#wsURL = "";
        this.#numShards = 1;
        this.#identifyInterval = 5000;


        this.#shards = new ShardManager(this);
        this.#events = new Map();

        this.login();
    }

    async login(){
        const gateway: Gateway = await this.getGateway();
        this.#wsURL = `${gateway.url}/?v=${DISCORD_API_VERSION}&encoding=json`
        this.#numShards = gateway.shards;
        this.#identifyInterval = gateway.session_start_limit.max_concurrency * 5000;         
        
        this.#shards.start();
    }

    on(event: string, callback: Function){
        this.#events.set(event, callback);
    }

    emit(event: string, data?: any){
        const func = this.#events.get(event);
        if(func) func(data);
    }

    get token(){return this.#token}
    get wsURL(){return this.#wsURL}
    get numShards(){return this.#numShards}
    get identifyInterval(){return this.#identifyInterval}
    get shards(){return this.#shards}


}

export { Client };